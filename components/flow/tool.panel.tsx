import { memo } from "react"
import styles from '@/styles/Home.module.css'
const ToolPanel = () => {
    return (
        <div className={styles.tool_panel_div}
            style={{ borderRadius: 20, width: 200, height: 50, backgroundColor: '#22111188', border: '3px solid #221199aa' }}>
        </div>
    )
}

export default memo(ToolPanel);