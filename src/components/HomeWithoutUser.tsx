import { SignUpButton } from '@clerk/nextjs';
// import { createStyles, Container, Text, Button, Group, rem } from '@mantine/core';
// import { IconUser } from "@tabler/icons-react"

// const useStyles = createStyles((theme) => ({
//     wrapper: {
//         position: 'relative',
//         boxSizing: 'border-box',
//         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
//     },

//     inner: {
//         position: 'relative',
//         paddingTop: rem(50),
//         paddingBottom: rem(60),

//         [theme.fn.smallerThan('sm')]: {
//             paddingBottom: rem(30),
//             paddingTop: rem(40),
//         },
//     },

//     title: {
//         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//         fontFamily: `Greycliff CF, ${theme.fontFamily}`,
//         fontSize: rem(62),
//         fontWeight: 900,
//         lineHeight: 1.1,
//         margin: 0,
//         padding: 0,
//         color: theme.colorScheme === 'dark' ? theme.white : theme.black,

//         [theme.fn.smallerThan('sm')]: {
//             fontSize: rem(42),
//             lineHeight: 1.2,
//         },
//     },

//     description: {
//         marginTop: theme.spacing.xl,
//         fontSize: rem(24),

//         [theme.fn.smallerThan('sm')]: {
//             fontSize: rem(18),
//         },
//     },

//     controls: {
//         marginTop: `calc(${theme.spacing.xl} * 2)`,

//         [theme.fn.smallerThan('sm')]: {
//             marginTop: theme.spacing.xl,
//         },
//     },

//     control: {
//         height: rem(54),
//         paddingLeft: rem(38),
//         paddingRight: rem(38),

//         [theme.fn.smallerThan('sm')]: {
//             height: rem(54),
//             paddingLeft: rem(18),
//             paddingRight: rem(18),
//             flex: 1,
//         },
//     },
// }));

export function HomeWithoutUser() {
    // const { classes } = useStyles();

    return (
        <div >
            {/* <Container size={700} className={classes.inner}>
                <h1 className={classes.title}>
                    Unleash Your Decoding Skills with{" "}
                    <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
                        Encodeo
                    </Text>{" "}
                </h1>

                <Text className={classes.description} color="dimmed">
                    🔓 Encodeo: The exciting decoding competition hosted by GEC Palakkad, as a pre-event for Invento, the tech fest. 🧠 Put your decoding skills to the test and unravel challenging puzzles. 🕵️‍♂️ Join now and showcase your knack for unraveling secrets and solving intricate codes! 🏆
                </Text>

                <Group className={classes.controls}>

                    <Button
                        component='a'
                        href='https://docs.google.com/forms/d/e/1FAIpQLSdRaAPXMNemIjmDEwmzTSAtjvqYZkETkTIViOhrNdmom1bi2g/viewform'
                        target="_blank"
                        size="xl"
                        className={classes.control}
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan' }}
                    >
                        Register for contest
                    </Button>


                    <SignUpButton>
                        <Button
                            size="xl"
                            variant="default"
                            className={classes.control}
                            leftIcon={<IconUser size={20} />}
                        >
                            Sign Up
                        </Button>
                    </SignUpButton>
                </Group>
            </Container> */}
        </div>
    );
}

export default HomeWithoutUser