# day47_playlist.py
# A playlist with normal, shuffled and repeating iterators.

import random


class Song:
    def __init__(self, title, artist, seconds):
        self.title = title
        self.artist = artist
        self.seconds = seconds

    def __str__(self):
        minutes, secs = divmod(self.seconds, 60)
        return f"{self.title} - {self.artist} ({minutes}:{secs:02d})"


class ShuffleIterator:
    """Plays every song once, in a random order."""

    def __init__(self, songs, seed=None):
        self.order = list(songs)
        random.Random(seed).shuffle(self.order)
        self.position = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.position >= len(self.order):
            raise StopIteration
        song = self.order[self.position]
        self.position += 1
        return song


class RepeatIterator:
    """Plays the songs in order, starting again at the end, up to a limit."""

    def __init__(self, songs, max_plays):
        self.songs = songs
        self.max_plays = max_plays
        self.played = 0

    def __iter__(self):
        return self

    def __next__(self):
        if not self.songs or self.played >= self.max_plays:
            raise StopIteration
        song = self.songs[self.played % len(self.songs)]
        self.played += 1
        return song


class Playlist:
    def __init__(self, name):
        self.name = name
        self.songs = []

    def add(self, song):
        self.songs.append(song)

    def __len__(self):
        return len(self.songs)

    def __iter__(self):
        return iter(self.songs)          # a fresh iterator every time

    def shuffled(self, seed=None):
        return ShuffleIterator(self.songs, seed)

    def repeat(self, max_plays):
        return RepeatIterator(self.songs, max_plays)

    def total_time(self):
        return sum(song.seconds for song in self)


def main():
    mix = Playlist("Study mix")
    mix.add(Song("Weightless", "Marconi Union", 480))
    mix.add(Song("Clair de Lune", "Debussy", 302))
    mix.add(Song("Experience", "Ludovico Einaudi", 315))
    mix.add(Song("Nuvole Bianche", "Ludovico Einaudi", 357))

    minutes = mix.total_time() // 60
    print(f"{mix.name}: {len(mix)} songs, {minutes} minutes\n")

    print("In order:")
    for number, song in enumerate(mix, start=1):
        print(f"  {number}. {song}")

    print("\nShuffle:")
    for song in mix.shuffled(seed=7):
        print("  ", song)

    print("\nRepeat (6 plays):")
    for song in mix.repeat(6):
        print("  ", song.title)

    print("\nArtists:", sorted({song.artist for song in mix}))


if __name__ == "__main__":
    main()
