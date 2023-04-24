import { getURL } from '@/utils/helpers';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { memo } from 'react';
import ReactFlow, { Instance, useReactFlow } from 'reactflow';
export const openLogin = (addNodes: Instance.AddNodes<any>) => {
    addNodes([
        {
            id: 'node-2', type: 'login_node', data: {},
            position: { x: 400, y: 250 }
        }
    ])
}

export const LoginNode = memo(() => {
    const supabaseClient = useSupabaseClient();

    return (
        <Auth
            supabaseClient={supabaseClient}
            providers={['github']}
            redirectTo={getURL()}
            magicLink={true}
            appearance={{
                theme: ThemeSupa,
                variables: {
                    default: {
                        colors: {
                            brand: '#404040',
                            brandAccent: '#52525b'
                        }
                    }
                }
            }}
            onlyThirdPartyProviders
        />
    )
})