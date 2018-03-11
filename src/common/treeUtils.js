const getParentNode = (nodeid , checkArray) => {
	  let parentId = null;
    for(let i in checkArray){
      	let node = checkArray[i];
      if(nodeid*1 == node.id*1){
          parentId = node.parentId;
          break;
      	}
      	if(node.children!=null){
          	parentId = getParentNode(nodeid,node.children)
            if(parentId!=null)break;
      	}
    }
    return parentId;
};
const treeUtils = {
    getParentNode
}

export default treeUtils

