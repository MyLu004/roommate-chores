let _editingId: string | null = null;

export function setEditingChoreId(id: string | null) {
  _editingId = id;
}

export function getEditingChoreId(): string | null {
  return _editingId;
}

export function clearEditingChoreId() {
  _editingId = null;
}
