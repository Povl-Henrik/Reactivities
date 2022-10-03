import { Message } from 'semantic-ui-react';

interface Props {
    errors: string[] ; // | null for at løse et problem i TestError, som jeg ikke fik ????;
}

export default function ValidationErrors({errors}: Props) {
    return (
        <Message error>
            {errors && (
                <Message.List>
                    {errors.map((err: any, i) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}
        </Message>
    )
}