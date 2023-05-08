const InputDialog_SubComp = () => (
    <div style={{
        flexDirection: 'column', borderRadius: 6, backgroundColor: '#aaaaaa', position: 'absolute', top: 32, width: 135, height: 102, justifyContent: 'center', alignItems: 'center', display: 'flex'
    }}>
        <div style={{ padding: 2, fontSize: 2, width: '95%', height: '80%', color: '#aaaaaa', backgroundColor: '#333333', borderRadius: 5 }}>
            {"Hi, I\'m GPT-4!"}
        </div>
        <input type="text" style={{ marginTop: 2, fontSize: 5, width: '95%', height: '13%', backgroundColor: '#333333', borderRadius: 3, textAlign: 'left', }} />
    </div>
)

export default InputDialog_SubComp