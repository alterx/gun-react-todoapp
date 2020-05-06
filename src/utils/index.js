export const instantiateNewGun = (Gun, peerlist) => () => {
  return Gun({ peers: peerlist });
};
