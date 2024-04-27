import sys
import subprocess
import os
import torch


def print_env_info():
    print()
    print()
    print("=====================================")
    sys.stdout.flush()
    print_cuda_info()
    print_cuda_dirs()
    print_gcc_version()
    print_gpp_version()
    print_nvcc_info()
    print_nv_smi_info()
    print("=====================================")
    print()
    print()


def print_cuda_info():
    print("torch.cuda.is_available() =", torch.cuda.is_available())
    print("PYTORCH_CUDA_ALLOC_CONF =", os.environ["PYTORCH_CUDA_ALLOC_CONF"])


def print_gcc_version():
    print("running:", "gcc --version")
    sys.stdout.flush()
    command = "gcc --version"
    subprocess.run(command.split())


def print_gpp_version():
    print("running:", "g++ --version")
    sys.stdout.flush()
    command = "g++ --version"
    subprocess.run(command.split())


def print_cuda_dirs():
    print("running:", "find / -name cuda")
    sys.stdout.flush()
    command = "find / -name cuda"
    subprocess.run(command.split())


def print_nvcc_info():
    print("running:", "find / -name nvcc")
    sys.stdout.flush()
    command = "find / -name nvcc"
    subprocess.run(command.split())


def print_nv_smi_info():
    print("running:", "nvidia-smi")
    sys.stdout.flush()
    command = "nvidia-smi"
    subprocess.run(command.split())
