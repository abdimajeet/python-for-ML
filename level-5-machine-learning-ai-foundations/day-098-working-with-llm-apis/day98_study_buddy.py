# day98_study_buddy.py
# A terminal study assistant built on the Claude API.

import os
import sys
from datetime import datetime
from pathlib import Path

import anthropic

MODEL = "claude-opus-5-5"
SYSTEM = """You are Study Buddy, a patient tutor for someone learning Python and machine learning
through a 100-day course. Explain ideas in plain language, with a short code example when it helps.
Now and then, ask a question back to check understanding. When asked for a quiz, ask three short
questions one at a time and wait for each answer before giving feedback. If you are not sure about
something, say so. Keep answers under about 200 words unless asked for more."""

HELP = """Commands:
  /quiz <topic>     quiz me on a topic
  /explain <idea>   explain an idea simply
  /reset            start a new conversation
  /save             save the conversation as Markdown
  /usage            tokens used so far
  /quit             exit
Anything else is sent as a normal message."""


def blocks_for_history(content):
    """Return the assistant turn to keep in the history.

    Blocks are kept as the API returned them (including any reasoning blocks).
    If the server switched to a fallback model part-way through an answer, the
    API docs say to keep only text blocks from before the switch.
    """
    switches = [i for i, block in enumerate(content) if block.type == "fallback"]
    if not switches:
        return content
    last = switches[-1]
    return [b for i, b in enumerate(content) if i > last or b.type == "text"]


class StudyBuddy:
    def __init__(self, client: anthropic.Anthropic):
        self.client = client
        self.messages = []
        self.transcript = []                 # (speaker, text) pairs for /save
        self.input_tokens = 0
        self.output_tokens = 0

    def ask(self, text: str) -> str:
        self.messages.append({"role": "user", "content": text})
        try:
            with self.client.beta.messages.stream(
                model=MODEL,
                max_tokens=4000,
                system=SYSTEM,
                messages=self.messages,
                output_config={"effort": "low"},            # quick, conversational answers
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",                        # retry on another model if this one declines
            ) as stream:
                for piece in stream.text_stream:
                    print(piece, end="", flush=True)
                final = stream.get_final_message()
        except anthropic.AuthenticationError:
            return self._fail("Your API key was rejected. Check ANTHROPIC_API_KEY.")
        except anthropic.RateLimitError:
            return self._fail("Too many requests. Wait a minute and try again.")
        except anthropic.APIStatusError as error:
            return self._fail(f"The API returned an error ({error.status_code}). Try again later.")
        except anthropic.APIConnectionError:
            return self._fail("Couldn't reach the API. Check your internet connection.")
        print()

        self.input_tokens += final.usage.input_tokens
        self.output_tokens += final.usage.output_tokens
        if final.stop_reason == "refusal":
            return self._fail("Study Buddy can't help with that one. Try asking another way.")
        if final.stop_reason == "max_tokens":
            print("[The answer was cut short. Ask me to continue.]")

        reply = "".join(block.text for block in final.content if block.type == "text")
        self.messages.append({"role": "assistant", "content": blocks_for_history(final.content)})
        self.transcript += [("You", text), ("Study Buddy", reply)]
        return reply

    def _fail(self, message: str) -> str:
        self.messages.pop()                  # forget the question that failed
        print(f"\n[{message}]")
        return ""

    def reset(self) -> None:
        self.messages.clear()
        self.transcript.clear()

    def save(self) -> Path:
        path = Path(f"study_session_{datetime.now():%Y%m%d_%H%M}.md")
        lines = [f"# Study session, {datetime.now():%d %B %Y}\n"]
        lines += [f"**{who}:** {text}\n" for who, text in self.transcript]
        path.write_text("\n".join(lines), encoding="utf-8")
        return path


def main() -> None:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("No API key found. Set the ANTHROPIC_API_KEY environment variable first (see the lesson).")
    buddy = StudyBuddy(anthropic.Anthropic())
    print("Study Buddy is ready. Type /help for commands.\n")
    while True:
        try:
            text = input("you> ").strip()
        except (EOFError, KeyboardInterrupt):
            text = "/quit"
        if not text:
            continue
        command, _, rest = text.partition(" ")
        if command == "/quit":
            print(f"Bye! You used {buddy.input_tokens + buddy.output_tokens:,} tokens this session.")
            break
        elif command == "/help":
            print(HELP)
        elif command == "/reset":
            buddy.reset()
            print("Started a new conversation.")
        elif command == "/save":
            print(f"Saved to {buddy.save()}")
        elif command == "/usage":
            print(f"Input tokens: {buddy.input_tokens:,}  Output tokens: {buddy.output_tokens:,}")
        elif command == "/quiz":
            print("buddy> ", end="")
            buddy.ask(f"Quiz me on {rest or 'what I have learned so far'}. Start with the first question.")
        elif command == "/explain":
            print("buddy> ", end="")
            buddy.ask(f"Explain {rest} simply, with a tiny example.")
        else:
            print("buddy> ", end="")
            buddy.ask(text)


if __name__ == "__main__":
    main()
