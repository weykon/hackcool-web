import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Gameview from '../components/game.view'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const supabase = useSupabaseClient()
  const user = useUser()

  return (
    <>
      <Head>
        <title>Hacker Cool!</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          {
            user && <button style={{ display: 'flex', width: 100, height: 50, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} onClick={() => supabase.auth.signOut()}>SignOut</button>
          }
          <p>
            Game: Hacker Cool !
          </p>
          {
            user && <div style={{ width: 50, height: 50, borderRadius: '50%', display: 'flex', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
              <img width={70} height={70} src={user.user_metadata.avatar_url} alt="" />
            </div>
          }
        </div>
        <div className={styles.center}>
          <Gameview />
        </div>
      </main>
    </>
  )
}
