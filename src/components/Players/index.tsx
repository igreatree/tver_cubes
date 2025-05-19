import { Stack, Title, Text, Button, TextInput, Group, CloseButton } from "@mantine/core";
import { useStore } from "../../store";
import { useState } from "react";

export const Players = () => {
    const { players, setStatus, addPlayer, removePlayer } = useStore();
    const [player, setPlayer] = useState('');
    const addPlayerHandler = () => {
        if (player) {
            if (players.includes(player)) {
                alert("Такой игрок уже есть!");
                return;
            }
            addPlayer(player);
            setPlayer('');
        }
    };
    return (
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
            <Title order={1}>
                Игроки:
            </Title>
            {players.map((player, index) => (
                <Group w={303} justify="space-between">
                    <Text
                        w={250}
                        style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                        }}
                        title={player}
                        key={index}
                    >
                        {player}
                    </Text>
                    <CloseButton onClick={() => removePlayer(index)} />
                </Group>
            ))}
            <Group>
                <TextInput placeholder="Введите имя игрока" value={player} onChange={(e) => setPlayer(e.target.value)} />
                <Button onClick={addPlayerHandler}>Добавить</Button>
            </Group>
            <Group w={303} justify="space-between">
                <Button w={140} variant="outline" onClick={() => setStatus('start')}>Назад</Button>
                <Button disabled={players.length < 2} w={140} color="lime" onClick={() => setStatus('game')}>Начать!</Button>
            </Group>
        </Stack>
    )
}