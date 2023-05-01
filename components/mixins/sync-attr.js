/** */
const SyncAttrMixin = (Parent) => {
  class SyncAttr extends Parent {
    /** */
    syncAttr(name) {
      if (this.isConnected) {
        this.setAttr(name, this[name]);
      }
    }
  }

  return SyncAttr;
};

export { SyncAttrMixin };
