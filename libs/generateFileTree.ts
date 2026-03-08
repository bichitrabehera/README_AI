type TreeNode = { [key: string]: TreeNode };

export function generateFileTree(paths: string[]): string {
  const tree: TreeNode = {};

  paths.forEach((path) => {
    const parts = path.split("/");
    let current: TreeNode = tree;
    parts.forEach((part) => {
      if (!current[part]) current[part] = {};
      current = current[part];
    });
  });

  function buildString(node: TreeNode, prefix = ""): string {
    const keys = Object.keys(node).sort();
    let result = "";
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const childPrefix = isLast ? "    " : "│   ";
      result += `${prefix}${connector}${key}\n`;
      result += buildString(node[key], prefix + childPrefix);
    });
    return result;
  }

  return buildString(tree);
}
