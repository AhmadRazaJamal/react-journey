import axios from 'axios';
import React from 'react';
import { sortBy } from 'lodash';
import SearchIcon from '@material-ui/icons/Search';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';

import './App.css';
import { ReactComponent as Check } from './check.svg';

const useStyles = makeStyles((theme) => ({
  input: {
    width: '80%',
    fontfamily: 'Lato',
    fontSize:"18px",
  },
  searchButton: {
    background: 'white',
    color: 'black',
    fontSize: '18px',
    fontFamily: 'Lato',
    '&:hover': {
        color: 'white',
        background: 'black',
    }
  },
  filterButton: {
    color: 'black',
    fontFamily: 'Lato',
    '&:hover': {
      color: 'white',
      background: 'black',
      border: '1px white solid'
  }
  }
}));

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const API_BASE = 'https://hn.algolia.com/api/v1/';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const getUrl = (searchTerm, page) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const extractSearchTerm = 
  url => 
  url.substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
  .replace(PARAM_SEARCH,'');

const getLastSearches = urls =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length - 1];

      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1);

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload.page === 0
          ? action.payload.list
          : state.data.concat(action.payload.list),
       page: action.payload.page,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], page: 0, isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload:{
          list: result.data.hits,
          page: result.data.page,
        }
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    handleSearch(searchTerm, 0);

    event.preventDefault();
  };

  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm);

    handleSearch(searchTerm, 0);
  };

  const handleSearch = (searchTerm,page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  const lastSearches = getLastSearches(urls);


  return (
    <div className="container">
      <h1 className="headline-primary">My React Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />

<hr />

      {stories.isError && <p>Something went wrong ...</p>}

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (

      <Button onClick={handleMore} style={{marginLeft: 'auto', marginRight:'auto', marginTop:'25px', display:'block', padding:'10px 50px'}} variant='contained' color='secondary'>
      Show More
    </Button>
      )}
      
    </div>
  );
};

const LastSearches = ({ lastSearches, onLastSearch }) => (
  <>
    {lastSearches.map((searchTerm, index) => (
      <Button
        key={searchTerm + index}
        type="button"
        variant="contained"
        color="primary"
        style={{marginLeft: '15px'}}
        onClick={() => onLastSearch(searchTerm)}
      >
        {searchTerm}
      </Button>
    ))}
  </>
);


const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => {
  const classes = useStyles();

  return(
  <form onSubmit={onSearchSubmit} className="search-form">
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
    </InputWithLabel>

    <Button
      type="submit"
      variant="contained"
      disabled={!searchTerm}
      className={classes.searchButton}
      style={{marginLeft: '1%',padding:'1% 4%', width: '20%',}}
      size="large"
      startIcon={<SearchIcon/>}
    >
      Submit
    </Button>
  </form>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  const classes = useStyles();

  return (
    <>
      <label htmlFor={id} className="label">
        {children}
      </label>
      &nbsp;
      <TextField
        ref={inputRef}
        id={id}
        color={"primary"}
        type={type}
        value={value}
        onChange={onInputChange}
        className={classes.input}
        variant="outlined" 
        label="Search Term"
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => {
  
  const [sort, setSort] = React.useState({ sortKey: "NONE", isReverse: false });
 
  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse ? sortFunction(list) : sortFunction(list).reverse();

  const classes = useStyles();

  const handleSort = sortKey => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse ;
    setSort({sortKey, isReverse})
  }

  return(
  <div>
    <div className="list-header" style={{ display: 'flex'}}>
    <span style={{ width: '44%' }}><Button variant="outlined" className={classes.filterButton} onClick={() => handleSort("TITLE")}>Title</Button></span>
    <span style={{ width: '30%' }}><Button variant="outlined" className={classes.filterButton} onClick={() => handleSort("AUTHOR")}>Author</Button></span>
    <span style={{ width: '16%' }}><Button variant="outlined" className={classes.filterButton} onClick={() => handleSort("COMMENTS")}>Comments</Button></span>
    <span style={{ width: '13%' }}><Button variant="outlined" className={classes.filterButton} onClick={() => handleSort("POINTS")}>Points</Button></span>
    <span style={{ width: '10%', marginTop: '0.6%' }}>ACTIONS</span>
    </div>
  {sortedList.map(item => (
    <Item
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
  ))}
</div>
  );
}

const Item = ({ item, onRemoveItem }) => (
  <div className="item" style={{display: "flex"}}>
    <span style={{ width: '40%', marginLeft: '0.8%',  }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%', marginLeft: '1.2%', }}>{item.author}</span>
    <span style={{ width: '10%' }}>{item.num_comments}</span>
    <span style={{ width: '10%', marginLeft: '2.2%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <Button
        type="Button"
        onClick={() => onRemoveItem(item)}
        variant="contained"
        color="secondary"
        startIcon={<CancelIcon/>}
      >
        Delete
      </Button>
    </span>
  </div>
);

export default App; 
export { storiesReducer, SearchForm, InputWithLabel, List, Item };