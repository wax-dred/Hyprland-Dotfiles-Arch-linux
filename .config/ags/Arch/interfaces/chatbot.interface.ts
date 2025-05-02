export interface Message
{
    id: string,
    sender: string,
    receiver: string,
    content: string,
    timestamp: number,
}

export interface Provider
{
    name: string,
    icon: string,
    description: string,
}