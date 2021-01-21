FROM mcr.microsoft.com/vscode/devcontainers/javascript-node

COPY library-scripts/desktop-lite-debian.sh /tmp/library-scripts/
RUN apt-get update && bash /tmp/library-scripts/desktop-lite-debian.sh
ENV DBUS_SESSION_BUS_ADDRESS="autolaunch:" DISPLAY=":1" LANG="en_US.UTF-8" LANGUAGE="en_US.UTF-8"
ENTRYPOINT ["/usr/local/share/desktop-init.sh"]
CMD ["sleep", "infinity"]


# [Optional] Uncomment if you want to install an additional version of node using nvm
ARG EXTRA_NODE_VERSION=15
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
RUN sudo -u node npm install -g pnpm && pnpm install gulp ultra-runner commitizen -g
#     && pnpm install
#     && echo -e "dev=true" > .env

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get install -y firefox-esr

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && curl -sSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o /tmp/chrome.deb \
    && apt-get -y install /tmp/chrome.deb \
    && ALIASES="alias google-chrome='google-chrome --disable-dev-shm-usage'\nalias google-chrome-stable='google-chrome-stable --disable-dev-shm-usage'\n\alias x-www-browser='x-www-browser --disable-dev-shm-usage'\nalias gnome-www-browser='gnome-www-browser --disable-dev-shm-usage'" \
    && echo "${ALIASES}" >> tee -a /etc/bash.bashrc \
    && if type zsh > /dev/null 2>&1; then echo "${ALIASES}" >> /etc/zsh/zshrc; fi

# RUN apt install snapd
# RUN apt-get install libwebkit2gtk-4.0
# RUN apt-get install libEGL.so.1 libvpx.so.6 libwoff2dec.so.1.0.2 libharfbuzz-icu.so.0 libgstapp-1.0.so.0 libgstbase-1.0.so.0 libgstreamer-1.0.so.0 libgstpbutils-1.0.so.0 libgstaudio-1.0.so.0 libgsttag-1.0.so.0 libgstvideo-1.0.so.0 libgstgl-1.0.so.0 libgstcodecparsers-1.0.so.0 libgstfft-1.0.so.0 libjpeg.so.8 libenchant.so.1 libhyphen.so.0 libicui18n.so.66 libicuuc.so.66 libGLESv2.so.2
