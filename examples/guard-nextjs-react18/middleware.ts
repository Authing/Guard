import { NextRequest, NextResponse } from 'next/server'
import { AUTHING_APP_HOST, AUTHING_APP_ID } from './config'

// 限制 API 路由
export const config = {
  matcher: ['/api/(.*)']
}

export async function middleware(request: NextRequest) {
  // 获取请求头中的 token
  const token = request.headers.get('authorization') ?? ''
  const pathname = request.nextUrl.pathname

  if (!token) {
    // 未登录
    return NextResponse.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }

  // 获取用户拥有的权限，生产环境可以缓存此值，无须每次请求都重新拉取
  const res: {
    statusCode: number
    data: {
      userPermissionList: {
        resourceList: {
          strAuthorize: {
            value: string
            actions: string[]
          }
        }[]
      }[]
    }
  } = await fetch(`${AUTHING_APP_HOST}/api/v3/get-user-auth-resource-list`, {
    headers: {
      Authorization: token,
      'x-authing-app-id': AUTHING_APP_ID
    }
  }).then(res => res.json())

  if (res.statusCode !== 200) {
    return NextResponse.json(
      { success: false, message: 'Authorization check failed' },
      { status: 401 }
    )
  }

  // 是否具有 API 权限
  const authorized = res.data.userPermissionList.some(up => {
    return up.resourceList.some(rl => {
      return rl.strAuthorize?.value === pathname
    })
  })

  if (!authorized) {
    return NextResponse.json(
      { success: false, message: 'No permission' },
      { status: 401 }
    )
  }

  return NextResponse.next()
}
