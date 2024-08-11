/* eslint-disable */

'use client'

import { StreamableValue } from 'ai/rsc'
import { Button, cn, Spinner } from '@nextui-org/react'
import { ContextMetadataItemProps } from '~/types/context'
import { useState } from 'react'
import { useStreamableText } from 'hooks/useStreamableText'
import ReferenceItem from '~/components/display/ReferenceItem'
import CustomMarkdown from '~/components/display/CustomMarkdown'

export function BotMessage({
  content,
  msgReferenceList,
  className
}: {
  content: string | StreamableValue<string>,
  msgReferenceList: ContextMetadataItemProps[],
  className?: string,
}) {

  const [showAllReferenceList, setShowAllReferenceList] = useState<boolean>(false);

  const text = useStreamableText(content);

  return (
    <div className={cn('group relative flex items-start', className)}>
      <div className="w-full flex flex-col gap-2 overflow-hidden px-1">
        <CustomMarkdown
          text={text}
        />
        {msgReferenceList.length > 0 && (
          <div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(msgReferenceList.length > 4 && !showAllReferenceList ? msgReferenceList.slice(0, 3) : msgReferenceList).filter(item => !!item.href).map((reference, idx) => (
                <li key={idx}>
                  <ReferenceItem
                    index={idx + 1}
                    title={reference.title}
                    href={reference.href}
                  />
                </li>
              ))}
              {msgReferenceList.length > 4 && !showAllReferenceList && (
                <li>
                  <Button
                    onClick={() => setShowAllReferenceList(true)}
                    color='default' variant='flat' className='w-full h-full text-default-500'
                  >
                    <p className='text-sm'>View {msgReferenceList.length - 3} more</p>
                  </Button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export function BotCard({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="group relative flex items-start">
      <div className="w-full mt-4 mr-4 flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

export function SpinnerMessage(props: {
  message?: string,
}) {

  return (
    <div className="group relative flex items-start">
      <div className="w-full flex flex-col gap-2">
        <div className="h-[24px] flex flex-row items-center flex-1 space-x-2 space-y-2 overflow-hidden px-1">
          <Spinner size='sm' color='primary' />
          {props.message && <p className='text-sm text-primary'>{props.message}</p>}
        </div>
      </div>
    </div>
  )
}