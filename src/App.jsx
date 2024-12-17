import React, { useState, useCallback } from 'react';
import { ComponentTree } from './utils/componentTree';
import MainComponent from './components/MainComponent';
import { getRandomHexColor } from './utils/colorGenerator';

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
      const newChild2 = new ComponentTree(<MainComponent firstComponent={false} direction={direction} />, direction, parentNodeClone.color);
      parentNodeClone.addChild(newChild1)
      parentNodeClone.addChild(newChild2)
      setRoot(newRoot);
    }
  }, [root])

  const removeChildrenFromTree = useCallback((nodeToRemove) => {
    if (!nodeToRemove || !nodeToRemove.parent) return;

    const newRoot = root.clone();
    const parentNodeClone = findNodeById(newRoot, nodeToRemove.parent.id);
    const nodeToRemoveClone = findNodeById(newRoot, nodeToRemove.id);

    if (parentNodeClone && nodeToRemoveClone) {
      const siblings = parentNodeClone.removeChild(nodeToRemoveClone);
      console.log(`🔥 ~ removeChildrenFromTree ~ siblings:`, siblings)

      if (siblings.length == 0) {
        let tempNode = parentNodeClone;

        while (tempNode.parent && tempNode.parent.children.length < 2) {
          tempNode = tempNode.parent
        }

        if (!tempNode.parent) {
          newRoot.removeAllChildren();
        } else {
          const grandParentClone = findNodeById(newRoot, tempNode.parent.id);
          const nodeToRemoveClone = findNodeById(newRoot, tempNode.id);
          grandParentClone?.removeChild(nodeToRemoveClone);
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
      color: node.color,
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