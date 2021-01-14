class ChangeFileManager {
  constructor() {
    this._files = [];
    this._pristine = true;
  }

  get lastChangedFiles() {
    return this._files.slice();
  }

  get pristine() {
    return this._pristine;
  }

  addFile(file) {
    this._pristine = false;
    this._files.push(file);
  }

  addFiles(files) {
    files.forEach(f => this.addFile(f));
  }

  clear() {
    this._files = [];
  }
}

export let changeFileManager = new ChangeFileManager();
