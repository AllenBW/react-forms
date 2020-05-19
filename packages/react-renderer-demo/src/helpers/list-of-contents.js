import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import StickyBox from 'react-sticky-box';

const reqSource = require.context('!raw-loader!@docs/pages', true, /\.md/);

export const headerToId = (header) =>
  header
    .replace(/#/g, '')
    .replace(/ /g, '')
    .toLowerCase();

const useLinkStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 'calc(240px - 32px)',
    whiteSpace: 'nowrap',
    display: 'block',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    fontWeight: 'inherit'
  }
}));

const ListHeader = ({ text }) => {
  const classes = useLinkStyles();
  const router = useRouter();
  const level = (text.match(/#/g) || []).length;
  const labelText = text.replace(/#/g, '');
  return (
    <a className={classes.link} href={`${router.pathname}#${headerToId(text)}`} title={labelText}>
      {[...new Array(level)].map((_v, index) => (
        <React.Fragment key={index}>&nbsp;&nbsp;</React.Fragment>
      ))}
      {labelText}
    </a>
  );
};

ListHeader.propTypes = {
  text: PropTypes.string.isRequired
};

const useStyles = makeStyles((theme) => ({
  fixedContainer: {
    paddingLeft: 16
  },
  listItem: {
    padding: 0
  },
  listItemText: {
    margin: 0
  },
  listItemActive: {
    position: 'relative',
    background: theme.palette.common.white,
    '&::before': {
      position: 'absolute',
      left: -0,
      display: 'block',
      content: '""',
      width: 2,
      height: '100%',
      background: theme.palette.grey[700]
    }
  },
  contentHeader: {
    paddingLeft: 16,
    paddingRight: 16
  }
}));

const ListOfContents = ({ file }) => {
  const [activeItem, setActive] = useState();
  let isMounted = true;

  const scrollListener = (setActive) => {
    const min = -10;
    const max = 20;
    const elem = Array.from(document.querySelectorAll('[data-scroll]')).find((elem) => {
      const { top } = elem.getBoundingClientRect();
      return top > min && top < max;
    });
    if (isMounted && elem) {
      setActive(elem.id);
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', () => scrollListener(setActive));
    scrollListener(setActive);

    return () => {
      isMounted = false;
      document.removeEventListener('scroll', scrollListener);
    };
  }, []);
  const classes = useStyles();
  const text = reqSource(`./${file}.md`).default;

  const regex = /^#+ .*/gm;
  const found = text.match(regex) || [];
  return (
    <StickyBox offsetTop={96} offsetBottom={20}>
      <div className={classes.fixedContainer}>
        <Typography className={classes.contentHeader} component="h3">
          Content
        </Typography>
        <List dense>
          {found.map((text) => (
            <ListItem
              onClick={() => setActive(headerToId(text))}
              className={clsx(classes.listItem, { [classes.listItemActive]: headerToId(text) === activeItem })}
              key={text}
            >
              <ListItemText className={classes.listItemText} primary={<ListHeader text={text} />} />
            </ListItem>
          ))}
        </List>
      </div>
    </StickyBox>
  );
};

ListOfContents.propTypes = {
  file: PropTypes.string.isRequired
};

export default ListOfContents;
