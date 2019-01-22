/* eslint-disable no-undef */

const familyData = {
  data: {
    id: 'Adam',
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

const update = () => {
  const svg = d3.select('svg');

  // const width = document.body.clientWidth;
  const width = 1280;
  // const height = document.body.clientHeight;
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
    // .attr('text-anchor', d => (d.children ? 'middle' : 'start'))
    .text(d => d.data.data.id);

  g.exit().remove();
};
update();

// eslint-disable-next-line max-statements
const addParentRecursive = (child, parent, family = familyData.children) => {
  console.log('child', child);
  console.log('parent', parent);
  let newPerson = { data: { id: parent } };
  let personFound = false;
  if (child === 'Adam') {
    familyData.children.push(newPerson);
    console.log(familyData);
    const svg = d3.select('svg');
    svg.selectAll('*').remove();
    update();
    return;
  }
  for (let i = 0; i < family.length; ++i) {
    if (personFound) return;
    let current = family[i];
    if (current.data.id === child) {
      if (current.children) {
        current.children.push(newPerson);
        personFound = true;
        const svg = d3.select('svg');
        svg.selectAll('*').remove();
        update();
        return;
      } else {
        personFound = true;
        current.children = [newPerson];
        const svg = d3.select('svg');
        svg.selectAll('*').remove();
        update();
        return;
      }
    }
    if (current.children) {
      addParentRecursive(child, parent, current.children);
    }
  }
  const svg = d3.select('svg');
  svg.selectAll('*').remove();
  update();
};
