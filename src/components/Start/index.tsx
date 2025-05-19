import { Button, Stack, Title } from "@mantine/core"
import { useStore } from "../../store";
import styles from './start.module.scss';

export const Start = () => {
    const { setStatus } = useStore();

    return (
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
            <Title order={1} className={styles.title}>
                <span>Т</span><span>В</span><span>Е</span><span>Р</span><span>С</span><span>К</span><span>И</span><span>Е</span> <span>К</span><span>У</span><span>Б</span><span>Ы</span><span>!</span>
            </Title>
            <Button w={295} color="lime" onClick={() => setStatus('players')}>Начать!</Button>
        </Stack>
    )
}