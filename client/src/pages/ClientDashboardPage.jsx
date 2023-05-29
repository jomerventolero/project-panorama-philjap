import React from 'react'
import ClientNavbar from '../components/ClientNavbar'
import Explorer from '../components/Explorer'

const ClientDashboardPage = () => {
  return (
    <div>
        <ClientNavbar />
        <div className="flex flex-col items-center justify-center max-h-screen pt-20">
            <h1 className="text-4xl font-bold text-white">Welcome to your dashboard!</h1>
            <Explorer />
        </div>
    </div>
  )
}

export default ClientDashboardPage