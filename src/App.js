import React from 'react';
import './App.css';

const List = ({ list }) =>
  list.map(({objectID, ...item}) => <Item key={objectID} {...item} />);

const Item = ({ title, url, author, num_comments,
  points }) => (
    <div>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </div>
  );

const Search = (props) => {
  const { onSearch, searchTerm } = props;
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={onSearch} value={searchTerm} />
    </div>
  );
};

const App = () => {

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || 'React');

  const creatorsList = [
    {
      title: 'React ',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux ',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

React.useEffect(() => {
  localStorage.setItem('search', searchTerm);}
,[searchTerm]);

  const searchedCreatorList = creatorsList.filter(creator =>
    creator.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="App">
      <h1>
        My React Journey
      </h1>
      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <hr />

      <List list={searchedCreatorList} />

    </div>

  );
};

export default App;
