import '@mantine/core/styles.css';
import { Stack } from '@mantine/core';
import { Start } from './components/Start';
import { useStore } from './store';
import { Players } from './components/Players';
import { Table } from './components/Table';

function App() {
  const { status } = useStore();
  return (
    <Stack>
      {status === 'start' && <Start />}
      {status === 'players' && <Players />}
      {status === 'game' && <Table />}
    </Stack>
  )
}

export default App;
