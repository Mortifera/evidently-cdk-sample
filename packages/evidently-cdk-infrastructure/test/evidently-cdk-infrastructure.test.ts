import { app } from '../bin/evidently-cdk-infrastructure';

const synthedApp = app.synth();

test('Stack Names', () => {
    const stackNames = synthedApp.stacks.map(stack => stack.stackName).sort();
    expect(stackNames).toMatchSnapshot();
});

synthedApp.stacks.forEach(stack => {
    test('Stack Templates - ' + stack.stackName, () => {
        expect(JSON.stringify(stack.template, undefined, 4)).toMatchSnapshot();
    });
});
