export function tags(note) {
  return (note.body.match(/#\w+/g) || []).map(t => t.slice(1));
}

export function hasTag(note, tag) {
  return tags(note).some(t => t.toLowerCase() === tag.toLowerCase());
}
