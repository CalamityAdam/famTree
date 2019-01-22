/* eslint-disable max-statements */
/* eslint-disable no-undef */

const familyData = {
  data: {
    id: '',
  },
  children: [
    // {
    //   data: {
    //     id: 'Wayne',
    //   },
    // },
    // {
    //   data: {
    //     id: 'Donna',
    //   },
    // },
  ],
};

// save the tree layout in a function we can call later when information is updated
const update = () => {
  const svg = d3.select('svg');

  const width = 1280;
  const height = 720;

  const margin = { top: 0, right: 175, bottom: 0, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const treeLayout = d3.tree().size([innerHeight, innerWidth]);

  const zoomG = svg
    .attr('width', width)
    .attr('height', height)
    .append('g');

  const g = zoomG
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  // handle zoom and moving around of tree
  svg.call(
    d3.zoom().on('zoom', () => {
      zoomG.attr('transform', d3.event.transform);
    }),
  );

  const root = d3.hierarchy(familyData);
  const links = treeLayout(root).links();
  const linkPathGenerator = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);

  g.selectAll('path')
    .data(links)
    .enter()
    .append('path')
    .attr('d', linkPathGenerator);

  g.selectAll('text')
    .data(root.descendants())
    .enter()
    .append('text')
    .attr('x', d => d.y)
    .attr('y', d => d.x)
    .attr('dy', '.32em')
    .text(d => d.data.data.id);

  g.exit().remove();
};
// initialize the tree by default...
update();

const doUpdate = () => {
  // find svg, select EVERYTHING inside of it and remove, then initialize with update (or original) data
  const svg = d3.select('svg');
  svg.selectAll('*').remove();
  update();
};

const addParentRecursive = (child, parent, family = familyData.children) => {
  let newPerson = { data: { id: parent } };
  // if user not input parent name && there is no name at rood node
  if (parent === 'parent name' && familyData.data.id === '') {
    familyData.data.id = child;
    return doUpdate();
  }

  // if at root, do not traverse children, instead push directly into children
  if (child === familyData.data.id) {
    familyData.children.push(newPerson);
    return doUpdate();
  }

  // traverse children array
  for (let i = 0; i < family.length; ++i) {
    let current = family[i];
    // if at person is who we're looking for
    if (current.data.id === child) {
      // if they have a children array push into the children array
      if (current.children) {
        current.children.push(newPerson);
        return doUpdate();
        // else create children array with new person at index 0
      } else {
        current.children = [newPerson];
        return doUpdate();
      }
    }
    // if not at person we're looking for and they have an array of children, recursively search through their children array
    if (current.children) {
      addParentRecursive(child, parent, current.children);
    }
  }
  // failsafe - no errors, just do update
  return doUpdate();
};
