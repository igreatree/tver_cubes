import { Grid, Button, Group, NumberInput, CloseButton, Image } from "@mantine/core";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import HandIcon from "../../assets/icons/hand.svg";
import EditIcon from "../../assets/icons/edit.svg";
import styles from './table.module.scss';

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
    const [countTotal, setCountTotal] = useState(0);
    const [isSecondHouseOpened, setIsSecondHouseOpened] = useState(false);
    const span = 12 / (players.length + 1);
    useEffect(() => {
        let ct = 0;
        players.forEach((player) => {
            let res = 0;
            let c = 0;
            const fh = Object.values(data).filter(i => i.type === "first");
            for (let i = 0; i < fh.length; i++) {
                const current = fh[i].values[player];
                if (typeof +current === "number" && !isNaN(+current)) {
                    res += +current;
                    c++;
                    ct++;
                } else if (current === "X") {
                    c++;
                    ct++;
                }
            };
            if (c >= 3) {
                setIsSecondHouseOpened(true);
            } else {
                setIsSecondHouseOpened(false);
            }
            const firstHouseValue = res < 0 ? res - 50 : res;
            setFirstHouseData((prev) => ({ ...prev, [player]: firstHouseValue === 0 ? "0" : firstHouseValue }));

            const all = Object.values(data).filter(i => i.type !== "first").filter(i => i.type !== "finish");
            let total = 0;

            total += firstHouseValue
            for (let i = 0; i < all.length; i++) {
                const current = all[i].values[player];
                if (typeof +current === "number" && !isNaN(+current)) {
                    total += +current;
                    ct++;
                } else if (current === "X") {
                    ct++;
                } else {
                }
            };
            setCountTotal(ct);
            setFinishData((prev) => ({ ...prev, [player]: total === 0 ? "0" : total }));
        });
    }, [data]);

    useEffect(() => {
        console.log({ countTotal })
        if (countTotal === 15 * players.length) {
            let winner = { score: 0, name: "" };
            if (Object.values(finishData).length === players.length) {
                Object.entries(finishData).forEach(([key, value]) => {
                    if (+value > winner.score) {
                        winner.score = +value;
                        winner.name = key;
                    }
                });
                if (Object.values(finishData).length === players.length) {
                    alert(`Победитель - "${winner.name}"!`);
                }
            }
        }
    }, [countTotal]);

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
                        <Grid.Col key={key} bg={value.type === "firstHouse" || value.type === "finish" ? "lime" : ""} span={span}>
                            <Group h={36} justify="center">
                                {key}
                            </Group>
                        </Grid.Col>
                        {players.map((player) => {
                            const val = value.values[player];
                            if (val && val !== '+' && val !== '-' && val !== '*' && val !== 'edit') {
                                return <Grid.Col span={span} key={player}>
                                    <Group mih={36} h="100%" justify="center" align="center" >
                                        {value.values[player]}
                                        {/* {value.type === 'second' && value.values[player] !== "X" && <CloseButton color="red" onClick={() => setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: 'X' } } })} />} */}
                                        {<Button size="xs" variant="transparent" onClick={() => setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: 'edit' } } })} ><Image w={20} src={EditIcon} /></Button>}
                                    </Group>
                                </Grid.Col>
                            } else if (val === 'edit') {
                                return <Grid.Col span={span} key={player}>
                                    <Group mih={36} h="100%" justify="center" align="center" >
                                        <NumberInput
                                            w={100}
                                            onBlur={(e) => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: e.target.value } } });
                                            }}
                                        />
                                    </Group>
                                </Grid.Col>
                            } else {
                                return <Grid.Col bg={value.type === "firstHouse" || value.type === "finish" ? "lime" : ""} span={span} key={player}>
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
                                            disabled={!isSecondHouseOpened}
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
                                            disabled={!isSecondHouseOpened}
                                            onClick={() => {
                                                setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: "+" } } });
                                            }}
                                        >
                                            +
                                        </Button>
                                        <CloseButton disabled={!isSecondHouseOpened} color="red" onClick={() => setData({ ...data, [key]: { ...data[key], values: { ...data[key].values, [player]: 'X' } } })} />
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