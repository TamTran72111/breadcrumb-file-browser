import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const history = useHistory();

  const [info, setInfo] = useState({});
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/path/root${location.pathname}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('404');
        } else {
          return response.json();
        }
      })
      .then((data) => {
        let path = '';
        const paths = [
          {
            name: 'root',
            path: '/',
          },
        ];
        location.pathname
          .split('/')
          .filter((path) => path !== '')
          .forEach((name) => {
            path = `${path}/${name}`;
            paths.push({
              name,
              path,
            });
          });

        setPaths(paths);
        setInfo(data);
      })
      .catch((err) => {
        history.push('/');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const renderBreadscrumb = () => {
    return paths.map((path, i) => {
      return (
        <li
          key={path.path}
          className={i === paths.length - 1 ? 'is-active' : ''}
        >
          <Link to={path.path}>{path.name}</Link>
        </li>
      );
    });
  };

  const renderChildren = () => {
    if (info.type !== undefined) {
      const locationName = paths[paths.length - 1].name;
      let locationPath = paths[paths.length - 1].path;
      if (locationPath === '/') {
        locationPath = '';
      }
      if (info.type === 'file') {
        return (
          <p className="has-text-centered">
            THIS IS A FILE: <strong>{locationName}</strong>
          </p>
        );
      } else {
        return (
          <div className="is-flex">
            {info.children.map((child) => {
              const path = `${locationPath}/${child.name}`;
              return (
                <Link key={path} to={path}>
                  <div className="is-flex is-flex-direction-column child">
                    <span className="icon is-size-1">
                      {child.type === 'file' ? (
                        <i className="far fa-file"></i>
                      ) : (
                        <i className="fas fa-folder"></i>
                      )}
                    </span>
                    <span>{child.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        );
      }
    }
  };

  return (
    <div>
      <nav className="breadcrumb">
        <ul>{renderBreadscrumb()}</ul>
      </nav>
      <hr class="mb-1" />
      <div className="children">{renderChildren()}</div>
    </div>
  );
};

export default Breadcrumb;
