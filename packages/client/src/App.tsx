function App() {
  const bigYikes = [
    {
      id: 1,
      author: 'Stephen',
      date: 1655174802865,
      content: 'I did a yikes',
    },
    {
      id: 2,
      author: 'Matootie',
      date: 1655175107836,
      content: 'Poo poo coming out!',
    },
  ];
  return (
    <div>
      <ul>
        {bigYikes.map((e) => (
          <li key={e.id}>{e.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
