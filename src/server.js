// Edit the content of this root object to change the folder structure.
let root = {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        myname: {
          type: 'dir',
          children: {
            'filea.txt': {
              type: 'file',
            },
            'fileb.txt': {
              type: 'file',
            },
            projects: {
              type: 'dir',
              children: {
                mysupersecretproject: {
                  type: 'dir',
                  children: {
                    mysupersecretfile: {
                      type: 'file',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const paths = {};

const transformStructure = (parent, name, root) => {
  const path = `${parent}/${name}`;
  if (root.type === 'dir') {
    const children = [];
    Object.keys(root.children).forEach((name) => {
      children.push({ name, type: root.children[name].type });
      transformStructure(path, name, root.children[name]);
    });
    paths[path] = {
      type: 'dir',
      children,
    };
  } else {
    paths[path] = { type: 'file' };
  }
};
transformStructure('', 'root', root);

const stripTrailingSlash = (path) => {
  while (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  return path;
};

const getPath = (path) => {
  const matchStart = '/path';
  if (path.startsWith(matchStart)) {
    return stripTrailingSlash(path.substring(matchStart.length));
  }
  return undefined;
};

app.get('*', (req, res) => {
  const path = getPath(req.originalUrl);
  if (paths[path] !== undefined) {
    res.json(paths[path]);
  } else {
    res.status(404).json({ path: 'Path Not Found' });
  }
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {});
