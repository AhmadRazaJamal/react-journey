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

  const InputWithLabel = ({
    id,
    value,
    type = 'text',
    onInputChange,
    children,
    isFocused
  }) => {

    const inputRef = React.useRef();

    React.useEffect(() => {
      if (isFocused && inputRef.current) {
        
        inputRef.current.focus();
      }
    }, [isFocused]);
    
    return(
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        ref={inputRef}
      />
    </>
  );
};

const initialCreatorsList = [
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

const useSemiPersistentState = (key, InitialState) => {
  const [value, SetValue] = React.useState(
    localStorage.getItem(key) || InitialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);}
  ,[key, value]);

  return [value, SetValue];
  
}

const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search','React');

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

  const searchedCreatorList = creatorsList.filter(creator =>
    creator.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="App">
      <h1>
        My React Journey
      </h1>
      
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

     <hr />

      <List list={searchedCreatorList} />

    </div>

  );
};

export default App;
