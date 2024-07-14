import React from 'react'

export default function LogoTextComponent({title}) {
    return (
        <a href="#" className="flex items-center  text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
            {title ?? "KittiBite"}
        </a>
    )
}
