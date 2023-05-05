
type UserCursor = {
    id: string,
    data: {
        name: string,
        color: string,
    }
}

const CursorNode = ({ data }: UserCursor) => {
    return (
        <div
            style={{
                position: 'absolute', width: 20, height: 20,
                borderRadius: '50%',
                backgroundColor: data.color,
            }}>
            <div style={{ position: 'absolute', left: 20, top: -2, textAlign: 'start' }}>{data.name}</div>
        </div>
    )
}

export default CursorNode;