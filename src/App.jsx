import React, { useState, useCallback } from 'react';
import { ComponentTree } from './utils/componentTree';
import MainComponent from './components/MainComponent';

function App() {
  const [root, setRoot] = useState(() => {
    const initialRoot = new ComponentTree(<MainComponent firstComponent direction="row" />, "row");
    return initialRoot;
  });

  const updateParentDirectionAndAddChildren = useCallback((parentNode, direction) => {
    const newRoot = root.clone()
    const parentNodeClone = findNodeById(newRoot, parentNode.id)
    if (parentNodeClone) {
      parentNodeClone.direction = direction;
      const newChild1 = new ComponentTree(<MainComponent firstComponent={false} direction={direction} />, direction);
      const newChild2 = new ComponentTree(<MainComponent firstComponent={false} direction={direction} />, direction);
      parentNodeClone.addChild(newChild1)
      parentNodeClone.addChild(newChild2)
      setRoot(newRoot);
    }
  }, [root])

  // const removeChildrenFromTree = useCallback((nodeToRemove) => {
  //   if (!nodeToRemove || !nodeToRemove.parent) return;

  //   const newRoot = root.clone();
  //   const parentNodeClone = findNodeById(newRoot, nodeToRemove.parent.id);
  //   const nodeToRemoveClone = findNodeById(newRoot, nodeToRemove.id);

  //   if (parentNodeClone && nodeToRemoveClone) {
  //     // Remove *both* children of the parent:
  //     // parentNodeClone.children = []; // Simplest and most efficient way
  //     parentNodeClone.removeAllChildren();
  //     setRoot(newRoot);
  //   }
  // }, [root]);

  const removeChildrenFromTree = useCallback((nodeToRemove) => {
    if (!nodeToRemove || !nodeToRemove.parent) return;

    const newRoot = root.clone();
    const parentNodeClone = findNodeById(newRoot, nodeToRemove.parent.id);
    const nodeToRemoveClone = findNodeById(newRoot, nodeToRemove.id);

    if (parentNodeClone && nodeToRemoveClone) {
      const siblings = parentNodeClone.children.filter(child => child.id !== nodeToRemoveClone.id);

      if (siblings.length === 1) {
        if (siblings[0].children.length === 0) {
          // Check if parent still exists in the tree before removing
          if (parentNodeClone.parent) { // Crucial check!
            const grandParentClone = findNodeById(newRoot, parentNodeClone.parent.id);
            if (grandParentClone) {
              grandParentClone.removeChild(parentNodeClone);
            }
          }
        } else {
          parentNodeClone.removeChild(nodeToRemoveClone);
        }
      } else if (siblings.length === 0) {
        // Check if parent still exists in the tree before removing
        if (parentNodeClone.parent) { // Crucial check!
          const grandParentClone = findNodeById(newRoot, parentNodeClone.parent.id);
          if (grandParentClone) {
            grandParentClone.removeChild(parentNodeClone);
          }
        }
      }
      setRoot(newRoot);
    }
  }, [root]);

  const findNodeById = (node, id) => {
    if (node.id === id) {
      return node;
    }
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) {
        return found;
      }
    }
    return null;
  };

  const renderTree = (node) => {
    return React.cloneElement(node.component, {
      direction: node.direction,
      children: node.children.map(renderTree),
      onClick: (e) => {
        e.stopPropagation();
        const target = e.target;
        const textContent = target.textContent;

        if (textContent === 'V' || textContent === 'H') {
          const direction = textContent === 'H' ? 'column' : 'row';
          updateParentDirectionAndAddChildren(node, direction);
        } else if (target.id === "minus" && node.parent) {
          removeChildrenFromTree(node);
        }
      },
    });
  };

  return <div className="p-4 bg-white fixed w-full h-full">{renderTree(root)}</div>;
}

export default App;