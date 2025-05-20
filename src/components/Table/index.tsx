import { Grid, Button, Group, NumberInput, CloseButton, Image } from "@mantine/core";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import HandIcon from "../../assets/icons/hand.svg";
import styles from './table.module.scss';

const firstHouse = ["1", "2", "3", "4", "5", "6"];
const rules: { [key: string]: { type: string, values: { [key: string]: string | number }, bonus?: number } } = {
    "1": {
        type: "first",
        values: {},
    },
    "2": {
        type: "first",
        values: {},
    },
    "3": {
        type: "first",
        values: {},
    },
    "4": {
        type: "first",
        values: {},
    },
    "5": {
        type: "first",
        values: {},
    },
    "6": {
        type: "first",
        values: {},
    },
    "1ДОМ": {
        type: "firstHouse",
        values: {},
    },
    "П": {
        type: "second",
        values: {},
    },
    "ПП": {
        type: "second",
        values: {},
    },
    "Т": {
        type: "second",
        values: {},
    },
    "МС (+10)": {
        type: "second",
        bonus: 10,
        values: {},
    },
    "БС (+20)": {
        type: "second",
        bonus: 20,
        values: {},
    },
    "ФХ (+30)": {
        type: "second",
        bonus: 30,
        values: {},
    },
    "К (+40)": {
        type: "second",
        bonus: 40,
        values: {},
    },
    "П! (+50)": {
        type: "second",
        bonus: 50,
        values: {},
    },
    "Мусор": {
        type: "third",
        values: {},
    },
    "ИТОГ": {
        type: "finish",
        values: {},
    }
};

export const Table = () => {
    const { players, setStatus } = useStore();
    const [data, setData] = useState(rules);
    const [firstHouseData, setFirstHouseData] = useState<{ [key: string]: string | number }>({});
    const [finishData, setFinishData] = useState<{ [key: string]: string | number }>({});
    const span = 12 / (players.length + 1);
    const [secondOpened, setSecondOpened] = useState(false);
    useEffect(() => {
        players.forEach((player) => {
            let res = 0;
            let closed = true;
            let count = 0;
            for (let i = 0; i < firstHouse.length; i++) {
                const current = data[firstHouse[i]].values[player];
                if (typeof +current === "number" && !isNaN(+current)) {
                    res += +current;
                    count++;
                } else if (current === "X") {
                    res += 0;
                    count++;
                } else {
                    closed = false;
                }
            };
            if (count === 3) setSecondOpened(true);
            else if (count < 3) setSecondOpened(false)
            setFirstHouseData((prev) => ({ ...prev, [player]: !closed ? "еще не закрыт" : res < 0 ? res - 50 : res === 0 ? "0" : res }));

            const all = Object.values(data).filter(i => i.type !== "firstHouse").filter(i => i.type !== "finish");
            let total = 0;
            let finished = true;
            for (let i = 0; i < all.length; i++) {
                const current = all[i].values[player];
                if (typeof +current === "number" && !isNaN(+current)) {
                    total += +current;
                } else if (current !== "X") {
                    finished = false;
                }
            };
            setFinishData((prev) => ({ ...prev, [player]: !finished ? "игра еще идет" : total }));
        });
    }, [data]);

    useEffect(() => {
        let winner = { score: 0, name: "" };
        if (Object.values(finishData).filter(v => v !== "игра еще идет").length === players.length) {
            Object.entries(finishData).forEach(([key, value]) => {
                if (+value > winner.score) {
                    winner.score = +value;
                    winner.name = key;
                }
            })
            alert(`Победитель - "${winner.name}"!`);
        }
    }, [finishData]);

    return (
        <>
            <Grid classNames={{ col: styles.col }}>
                <Grid.Col bg="blue" span={span}>
                    <Group justify="center">
                        Цель
                    </Group>
                </Grid.Col>
                {players.map((player, index) => (
                    <Grid.Col bg="blue" span={span} key={index}>
                        <Group justify="center">
                            {player}
                        </Group>
                    </Grid.Col>
                ))}
                {Object.entries(data).map(([key, value]) => (
                    <>
                        <Grid.Col bg={value.type === "firstHouse" || value.type === "finish" ? "lime" : ""} span={span} key={key}>
                            <Group h={36} justify="center">
                                {key}
                            </Group>
                        </Grid.Col>
                        {players.map((player, index) => {
                            const val = value.values[player];
                            if (val && val !== '+' && val !== '-' && val !== '*') {
                                return <Grid.Col span={span} key={index}>
                                    <Group mih={36} h="100%" justify="center" align="center" >
                                        {value.values[player]}
                                        {value.type === 'second' && value.values[player] !== "X" && <CloseButton color="red" onClick={() => setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: 'X' } } })} />}
                                    </Group>
                                </Grid.Col>
                            } else {
                                return <Grid.Col bg={value.type === "firstHouse" || value.type === "finish" ? "lime" : ""} span={span} key={index}>
                                    {value.type === 'first' && val !== '+' && val !== '-' && <Group justify="center">
                                        <Button
                                            color="lime"
                                            variant="outline"
                                            onClick={() => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: 'X' } } });
                                            }}
                                            title="Закрыть"
                                        >
                                            X
                                        </Button>
                                        <Button
                                            color="lime"
                                            variant="outline"
                                            onClick={() => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: "+" } } });
                                            }}
                                        >
                                            +
                                        </Button>
                                        <Button
                                            color="red"
                                            variant="outline"
                                            onClick={() => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: "-" } } });
                                            }}
                                        >
                                            -
                                        </Button>
                                    </Group>}
                                    {value.type === 'first' && (val === '+' || val === '-') && <Group align="center" h="100%" justify="center">
                                        <NumberInput
                                            w={100}
                                            autoFocus
                                            onBlur={(e) => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: val === "-" && +e.target.value > 0 ? -e.target.value : e.target.value } } });
                                            }}
                                        />
                                    </Group>}
                                    {value.type === 'second' && val !== '+' && val !== '*' && <Group justify="center">
                                        <Button
                                            disabled={!secondOpened}
                                            variant="outline"
                                            color="lime"
                                            title="С руки"
                                            onClick={() => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: "*" } } });
                                            }}
                                        >
                                            <Image src={HandIcon} />
                                        </Button>
                                        <Button
                                            color="lime"
                                            variant="outline"
                                            disabled={!secondOpened}
                                            onClick={() => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: "+" } } });
                                            }}
                                        >
                                            +
                                        </Button>
                                        <CloseButton disabled={!secondOpened} color="red" onClick={() => setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: 'X' } } })} />
                                    </Group>}
                                    {value.type === 'second' && (val === '+' || val === '*') && <Group justify="center">
                                        <NumberInput
                                            w={100}
                                            autoFocus
                                            onBlur={(e) => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: val === "*" ? +e.target.value * 2 + (data[key]?.bonus || 0) : +e.target.value + (data[key]?.bonus || 0) } } });
                                            }}
                                        />
                                    </Group>}
                                    {value.type === 'third' && <Group justify="center">
                                        <NumberInput
                                            w={100}
                                            disabled={!secondOpened}
                                            onBlur={(e) => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: e.target.value } } });
                                            }}
                                        />
                                    </Group>}
                                    {value.type === 'firstHouse' && <Group justify="center">
                                        {firstHouseData[player]}
                                    </Group>}
                                    {value.type === 'finish' && <Group justify="center">
                                        {finishData[player]}
                                    </Group>}
                                </Grid.Col>
                            }
                        })}
                    </>
                ))}
            </Grid>
            <Button onClick={() => setStatus('players')}>Назад</Button>
        </>
    );
}