export const setTrack = (ctx, track) => {
  const prevTrack = ctx.session.tags.track;
  if (prevTrack && prevTrack !== track) {
    ctx.session.tags.track_switched = `${prevTrack} → ${track}`;
  }
  ctx.session.tags.track = track;
};