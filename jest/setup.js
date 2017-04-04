jest.mock("Linking", () => {
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        openURL: jest.fn(),
        canOpenURL: jest.fn(),
        getInitialURL: jest.fn(),
    };
});

jest.mock("NetInfo", () => {
    return {
        isConnected: {
            fetch: () => {
                return new Promise((accept) => {    // eslint-disable-line no-undef
                    accept(true);
                });
            }
        },
        addEventListener: jest.fn(),
        fetch: () => {
            return {
                done: jest.fn()
            };
        }
    };
});
