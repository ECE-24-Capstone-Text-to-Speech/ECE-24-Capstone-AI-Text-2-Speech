import os

from fastapi.responses import FileResponse
import torch
import torchaudio
import torch.nn as nn
import torch.nn.functional as F
from tortoise_tts.tortoise.api import TextToSpeech
from tortoise_tts.tortoise.utils.audio import load_audio, load_voice, load_voices
import torchaudio
import IPython

# the tts base model to start off from
tts = TextToSpeech()

##from tortoise_tts.calltortoise import generate_voice_tortoise

##generate_voice_tortoise("daniel", "Hello. This is Angie's second A.I. voice. Nice to meet you!")

# This will download all the models used by Tortoise from the HF hub.
# tts = TextToSpeech()
# If you want to use deepspeed the pass use_deepspeed=True nearly 2x faster than normal


def tortoise_execute(
    user: str, input_text: str, output_dir: str, output_name: str, preset: str
):
    print(f"Loading user `{user}`'s voice files")
    # Load the custom voice for Tortoise. # Generate speech with the custom voice.
    ##needs to add a folder to tortoise_tts/tortoise/voices.
    ##for example the john folder is tortoise_tts/tortoise/voices/john, idk how to get load_voice to work without
    # this folder
    voice_samples, conditioning_latents = load_voice(
        voice=user, extra_voice_dirs=["../temp"]
    )  ##change
    print(f"Loaded the following voice samples to train on: {voice_samples}")

    print(f"Started Training on {user}'s inputs `{input_text}`")

    # Generate speech with the custom voice
    gen = tts.tts_with_preset(
        text=input_text,
        preset=preset,  # comment this as needed
        # preset="fast",
        voice_samples=voice_samples,
        conditioning_latents=conditioning_latents,
    )
    print("Finished generation of user voice")

    # Save the generated speech
    generated_path = f"{output_dir}/generated-{output_name}.wav"
    print(f"Saving generated audio to `{generated_path}`")
    torchaudio.save(
        uri=generated_path, audio_data=gen.squeeze(0).cpu(), sample_rate=24000
    )
    print("Tortoise generation done.")
    return generated_path


async def start_tortoise(input: str, user: str, output_folder: str, speed: str):
    """
    start the tortoise processing model
    @speed: the preset for tortoise
    """
    print("work")

    # Save the uploatts = TextToSpeech(use_deepspeed=True, kv_cache=True)

    # Optionally, upload use your own voice by running the next two cells. I recommend
    # you upload at least 2 audio clips. They must be a WAV file, 6-10 seconds long.

    CUSTOM_VOICE_NAME = user  ##go through custom voices and optimize this line. There's a bunch in tortoise/voices/
    custom_voice_folder = f"temp/{CUSTOM_VOICE_NAME}"

    # Save the uploaded files
    file1_path = os.path.join(custom_voice_folder, "1.wav")
    file2_path = os.path.join(custom_voice_folder, "2.wav")

    generated_path = tortoise_execute(
        user=user,
        input_text=input,
        output_dir=output_folder,
        output_name=CUSTOM_VOICE_NAME,
        preset=speed,
    )

    # Optionally, return the generated speech file to the client
    IPython.display.Audio(f"generated-{CUSTOM_VOICE_NAME}.wav")
    return FileResponse(generated_path, media_type="audio/wav", filename=generated_path)


async def start_tortoise_example():
    # This is the text that will be spoken.
    text = "Thanks for reading this article. I hope you learned something."  ##change to a frontend input

    user = "john"
    # Pick a "preset mode" to determine quality. Options: {"ultra_fast", "fast" (default), "standard", "high_quality"}. See docs in api.py
    preset = "ultra_fast"

    output_location = "../tortoise_generations"

    return await start_tortoise(
        input=text, user=user, output_folder=output_location, speed=preset
    )
