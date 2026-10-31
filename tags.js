export function tags(note) {
  return (note.body.match(/#\w+/g) || []).map(t => t.slice(1));
}
