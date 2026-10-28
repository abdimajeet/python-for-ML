# Day 98: Working with LLM APIs

**Level 5, Machine Learning & AI Foundations.** Project: **Small study-assistant chatbot**

Large language models (LLMs) like Claude can explain, summarise, write and reason in plain language, and you can use them from Python through an API. Today you'll learn how those calls work, what they cost, and how to handle the answers safely, then build a study assistant for this course.

## Lesson

### How an LLM API works

You send a request with a **model** name, a list of **messages** and a limit on the answer length, and you get back the model's reply. The API is **stateless**: it remembers nothing between calls, so to hold a conversation you send the whole history every time. Each message has a `role`: `"user"` for your side and `"assistant"` for the model's.


### API keys and cost

Create an account and API key at console.anthropic.com. The key is like a password that can spend money: store it in an environment variable called `ANTHROPIC_API_KEY`, never in your code, and never commit it to GitHub. You pay per **token** (a token is roughly three-quarters of a word), with separate prices for input and output. The response's `usage` tells you exactly how many tokens each call used. Set a monthly spending limit in the console while you learn.


### Your first call

Install the official library with `pip install anthropic`. The client reads your key from the environment. The reply's `content` is a list of **blocks**; the answer text is in blocks whose `type` is `"text"`. (The model may also return other block types, such as its internal reasoning, so always check the type.)

```python
import anthropic

client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY
response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1000,
    system="You are a friendly Python tutor. Answer in under 100 words.",
    messages=[{"role": "user", "content": "What is a list comprehension?"}],
)
for block in response.content:
    if block.type == "text":
        print(block.text)
print(response.usage.input_tokens, response.usage.output_tokens)
```

### System prompts and streaming

The `system` prompt sets the model's role and rules for the whole conversation: who it is, how long to answer, what to avoid. Clear, specific instructions work better than vague ones. For chat apps, **stream** the reply with `client.messages.stream(...)` so words appear as they're generated instead of after a long pause; `stream.text_stream` yields the text piece by piece.


### Handling responses safely

Check `stop_reason`: `"end_turn"` means a complete answer, `"max_tokens"` means it was cut off, and `"refusal"` means the model declined. Catch the library's specific errors: `AuthenticationError` (bad key), `RateLimitError` (slow down), `APIConnectionError` (network). And remember LLMs can be confidently wrong: for a study assistant, check important facts against the lesson or the docs.


## Exercises

1. Set your API key as an environment variable without putting it in code. (Windows PowerShell and macOS/Linux differ.)

<details><summary>Solution</summary>

```python
# macOS / Linux (add to ~/.zshrc or ~/.bashrc to make it permanent):
#   export ANTHROPIC_API_KEY="sk-ant-..."
# Windows PowerShell:
#   setx ANTHROPIC_API_KEY "sk-ant-..."   (then open a new terminal)
import os
print("key found" if os.environ.get("ANTHROPIC_API_KEY") else "no key")
```

</details>

2. Write a two-turn conversation by hand: ask a question, append the assistant's reply to `messages`, then ask a follow-up that depends on it.

<details><summary>Solution</summary>

```python
messages = [{"role": "user", "content": "Give me one Python tip."}]
r = client.messages.create(model="claude-opus-5-5", max_tokens=500, messages=messages)
messages.append({"role": "assistant", "content": r.content})
messages.append({"role": "user", "content": "Show me an example of that tip."})
r = client.messages.create(model="claude-opus-5-5", max_tokens=500, messages=messages)
```

</details>

3. Stream a short poem about NumPy and print it as it arrives.

<details><summary>Solution</summary>

```python
with client.messages.stream(
    model="claude-opus-5-5", max_tokens=500,
    messages=[{"role": "user", "content": "A four-line poem about NumPy."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

</details>

## Project: Small study-assistant chatbot

Build "Study Buddy", a terminal chatbot that tutors you on this course. It keeps the conversation history, streams answers, has commands for quizzes and explanations, can reset or save the conversation to Markdown, shows how many tokens you've used, and handles errors and refusals gracefully. Needs `pip install anthropic` and an `ANTHROPIC_API_KEY`. Each message costs a small amount, so keep an eye on `/usage`.

Files in this folder: `day98_study_buddy.py`.

### Key lines explained

- `anthropic.Anthropic()`: Creates the client. It finds your API key in the environment, so the key never appears in your code.
- `self.client.beta.messages.stream(...)`: Streams the answer so it appears word by word. It's on the `beta` namespace because of the fallback option below.
- `output_config={"effort": "low"}`: Tells the model not to think long before answering. Chat replies are fast and cheaper at low effort; raise it for hard questions.
- `betas=[...], fallbacks="default"`: If the model's safety checks decline a request by mistake, the server retries on another suitable model instead of failing. It's off unless you ask for it, and recommended for this model.
- `self.messages.append({"role": "assistant", "content": blocks_for_history(final.content)})`: The API is stateless, so the history grows each turn and is sent with every request. The reply is stored exactly as returned, which is what the API expects.
- `except anthropic.AuthenticationError:`: Specific errors get specific advice. The order matters: the more specific error classes come before the general `APIStatusError`.
- `self.messages.pop()`: If a request fails, the unanswered question is removed so the history stays a clean back-and-forth.

### Stretch goals

- Add `/level easy|normal|hard`, which adds a system-style instruction to the next message to change the difficulty.
- Load a lesson file from this course and ask questions about it (put its text in the first user message).
- Track the cost in dollars from the token counts using the current prices on the pricing page.

## Test it

- [ ] Run it without an API key set: you should get a clear message, not a crash. Then set a deliberately wrong key and check you get the "key was rejected" message.
- [ ] Ask a question, then a follow-up that says "give another example of that". The answer should show it remembers.
- [ ] Try `/quiz list comprehensions`, answer the questions, then `/save` and open the Markdown file.
- [ ] Check `/usage` grows with each message. Why does input usage grow faster than output?
