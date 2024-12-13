export class ComponentTree {
  constructor(component, direction = 'row') {
    this.id = crypto.randomUUID(); // Give each node a unique ID
    this.component = component;
    this.children = [];
    this.parent = null;
    this.direction = direction;
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(childToRemove) {
    this.children = this.children.filter(child => child.id !== childToRemove.id);
    childToRemove.parent = null;
  }

  removeAllChildren() {
    this.children.forEach((child) => {
      child.parent = null;
    });
    this.children = [];
  }

  // Crucial: Method to create a deep clone of the tree
  clone() {
    const newTree = new ComponentTree(this.component, this.direction);
    newTree.id = this.id; // Preserve the ID
    newTree.children = this.children.map(child => {
      const clonedChild = child.clone();
      clonedChild.parent = newTree;
      return clonedChild;
    });
    return newTree;
  }
}