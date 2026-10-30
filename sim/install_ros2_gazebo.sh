#!/usr/bin/env bash
# Ubuntu 24.04용 ROS 2 Jazzy + Gazebo Harmonic 설치
# ros-jazzy-ros-gz가 Jazzy와 짝이 맞는 Gazebo Harmonic을 함께 설치한다.
set -euo pipefail

sudo apt-get update
sudo apt-get install -y software-properties-common curl locales
sudo add-apt-repository -y universe

sudo locale-gen en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8

# ROS 2 apt 저장소 등록 (공식 ros2-apt-source 패키지)
ver=$(curl -fsSL https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest \
  | grep -F '"tag_name"' | awk -F'"' '{print $4}')
codename=$(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
deb=$(mktemp --suffix=.deb)
curl -fsSL -o "$deb" \
  "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ver}/ros2-apt-source_${ver}.${codename}_all.deb"
sudo dpkg -i "$deb"
rm -f "$deb"

sudo apt-get update
sudo apt-get install -y ros-jazzy-desktop ros-dev-tools ros-jazzy-ros-gz

line='source /opt/ros/jazzy/setup.bash'
grep -qxF "$line" ~/.bashrc || echo "$line" >> ~/.bashrc

source /opt/ros/jazzy/setup.bash
echo "ROS_DISTRO=$ROS_DISTRO"
gz sim --version
