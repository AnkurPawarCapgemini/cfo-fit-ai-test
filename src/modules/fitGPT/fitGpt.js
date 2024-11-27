import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Button, Icon } from 'semantic-ui-react';
import Plot from "react-plotly.js";
import { AgGridReact } from 'ag-grid-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { FitGptWrapper } from './style';
import FitDataScope from './FitDataScope';
import API_BASE_URL from '../../endPoint';

const MessageBubble = ({ message, isUser }) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    
    // Auto-size columns after grid is ready
    params.api.autoSizeAllColumns();
  }, []);

  const onExportClick = useCallback(() => {
    if (!gridApi) return;
    
    const selectedRows = gridApi.getSelectedRows();
    const exportParams = {
      fileName: 'fitgpt_export.csv',
      processCellCallback: (params) => {
        // Remove currency symbols and formatting for export
        if (params.column.colId === 'price') {
          return params.value ? params.value.toString().replace('$', '') : '';
        }
        return params.value;
      }
    };

    if (selectedRows.length > 0) {
      gridApi.exportSelectedToCSV(exportParams);
    } else {
      gridApi.exportDataAsCsv(exportParams);
    }
  }, [gridApi]);

  const Toolbar = () => (
    <div className="p-1 flex items-center justify-end gap-4">
      <button 
        onClick={onExportClick}
        className="px-4 py-1 border border-blue-500 text-blue-500 rounded-3xl hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Export to CSV
      </button>
    </div>
  );

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2 items-center block h-fit`}>
      {isUser ? (
        <>
          <div className="max-w-lg p-3 rounded-3xl bg-blue-500 text-white text-lg">
            <span style={{ whiteSpace: 'pre-line' }}>{message.text}</span>
          </div>
          <Icon name="user circle" size="large" className="ml-2" />
        </>
      ) : (
        <>
          <Icon name="modx" size="large" className="mr-2" />
          <div className="max-w-lg p-3 rounded-3xl bg-gray-900 text-white min-w-[1300px] text-lg">
            {
              message.content ? (
                <div>
                  {
                    message.type === 'text' ? (

                      <div>
                        {
                          message.content.includes('SELECT') ? (
                            <details>
                              <summary style={{ color: 'orange' }}>Generated SQL Query</summary>
                              <SyntaxHighlighter language="sql" style={nightOwl}>
                                {message.content}
                              </SyntaxHighlighter>
                            </details>
                          ) : (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: function Header1({ node, ...props }) { return <h1 className="ui header" style={{ color: '#A3D5A1' }}> {props.children} </h1>; }, // Light Green
                                h2: function Header2({ node, ...props }) { return <h2 className="ui header" style={{ color: '#7EC8E3' }}> {props.children} </h2>; }, // Sky Blue
                                h3: function Header3({ node, ...props }) { return <h3 className="ui header" style={{ color: '#F7A1C4' }}> {props.children} </h3>; }, // Light Pink
                                ul: ({ node, ...props }) => <ul className="ui list" style={{ color: '#A3D5A1' }} {...props} />, // Light Green
                                ol: ({ node, ...props }) => <ol className="ui list" style={{ color: '#7EC8E3' }} {...props} />, // Sky Blue
                                li: ({ node, ...props }) => <li className="item" style={{ color: '#F7A1C4' }} {...props} />, // Light Pink
                                strong: ({ node, ...props }) => <span className="ui bold" style={{ color: '#A3D5A1' }} {...props} />, // Light Green
                                em: ({ node, ...props }) => <em className="ui italic" style={{ color: '#7EC8E3' }} {...props} />, // Sky Blue
                                code({ node, inline, className, children, ...props }) {
                                  return !inline ? (
                                    <SyntaxHighlighter style={nightOwl} language="markdown" PreTag="div" {...props}>
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className={className} style={{ backgroundColor: '#F7A1C4', color: '#000' }} {...props}>
                                      {children}
                                    </code>
                                  )
                                }
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          )
                        }
                      </div>
                    ) :
                      message.type === 'table' ? (
                        (
                          <details>
                            <summary style={{ color: 'orange', display: 'flex', alignItems: 'center' }}>
                              <Icon name="expand" style={{ marginRight: '8px', top: '-5px', position: 'relative' }} />
                              Expand Table
                              <div style={{ marginLeft: 'auto' }}>
                                <Toolbar />
                              </div>
                            </summary>
                            <div
                              className="ag-theme-quartz h-full w-full flex justify-center"
                              style={{
                                '--ag-header-background-color': 'rgba(255, 255, 255, 0.1)',
                                '--ag-background-color': 'rgba(0, 0, 0, 0)',
                                '--ag-odd-row-background-color': 'rgba(0, 0, 0, 0)',
                                '--ag-border-width': '0.5px',
                                '--ag-cell-horizontal-border': 'solid',
                                '--ag-cell-vertical-border': 'solid',
                                '--ag-font-color': 'white', // Ensures text in the grid is white
                                '--ag-header-foreground-color': 'white', // Ensures text in the headers is white
                                '--ag-header-cell-text-color': 'white', // Ensures header text is white
                                '--ag-icon-font-color': 'white', // Ensures header icons are white
                                '--ag-icon-color': 'white', // Ensures filter and sort icons are white
                                'minHeight': '200px',
                                'maxHeight': '500px',
                                'overflowY': 'auto',
                                'overflowX': 'auto',
                                'color': 'white',
                                'width': 'auto',
                                'maxWidth': '100%'
                              }}
                            >
                              <AgGridReact
                                rowData={message.content.rowData}
                                columnDefs={message.content.columnDef}
                                defaultColDef={{
                                  sortable: false,
                                  resizable: false,
                                  cellStyle: { color: 'white' } // Ensures text in the cells is white
                                }}
                                autoSizeStrategy='SizeColumnsToContentStrategy'
                                domLayout='print'
                                pagination={false}
                                paginationPageSize={5}
                                csvExport={true}
                                onGridReady={onGridReady}
                              />
                            </div>
                          </details>

                        )
                      ) :
                        message.type === 'chart' ? (
                          <div className="h-fit min-h-[450px]">
                            <Plot
                              data={JSON.parse(message.content).data}
                              layout={{
                                ...JSON.parse(message.content).layout,
                                autosize: true,
                                margin: { l: 40, r: 40, t: 40, b: 40 },
                                plot_bgcolor: 'rgb(17, 24, 39)',
                                paper_bgcolor: 'rgb(17, 24, 39)',
                                template: 'plotly_dark',
                                font: { color: 'white' } // Ensures all text content is white
                              }}
                              useResizeHandler={true}
                              style={{ width: "100%", height: "100%", backgroundColor: 'rgb(17, 24, 39)' }}
                              config={{ responsive: true }}
                            />
                          </div>
                        ) : <></>
                  }
                </div>
              ) : <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
            }
          </div>
        </>
      )}
    </div>
  );
};

const Messages = React.memo(({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="p-4 overflow-y-auto relative" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      {messages.map((msg, index) => (
        <div key={index}>
          <MessageBubble message={msg} isUser={msg.isUser} />
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start mb-2 items-center">
          <Icon name="modx" size="large" className="mr-2" />
          <div className="max-w-xs p-3 rounded-lg bg-gray-800 text-black">
            <div className="typing-indicator">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
      <button type="button" className="fixed bottom-20 right-4 z-50 border border-gray-300 rounded-lg p-2" onClick={scrollToBottom}>
        <Icon name="arrow down" />
      </button>
    </div>
  );
});

export default function FitGpt() {
  const [messages, setMessages] = useState([
    {
      text: `Hello! How can I assist you today?\n
      You can ask questions about FIT Data, please set the scope of the data to answer broader questions
      `,
      isUser: false
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [cards, setCards] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  const [keyValueMap, setKeyValueMap] = useState({});
  const [followUp, setFollowUp] = useState(['Entity wise Contribution Analysis?', 'Top 3 engagements by Revenue in each region?']);

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/fitgpt/get_fit_params_and_defaults`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        const { cards, allKeys, keyValueMap } = response.data;
        setCards(cards);
        setAllKeys(allKeys);
        setKeyValueMap(keyValueMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();

    const inputValue = inputRef.current.value.trim();
    if (inputValue === "") return;

    setMessages(prevMessages => [...prevMessages, { text: inputValue, isUser: true }]);
    setIsTyping(true);
    inputRef.current.value = "";

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/fitgpt/submitQuery`, {
        query: inputValue,
        cards: cards
      }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const replies = response.data;

      setMessages(prevMessages => [
        ...prevMessages,
        ...replies.map(reply => ({ type: reply.type, isUser: false, content: reply.data }))
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Error: Could not send message', isUser: false },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [cards]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage(e)
    }
  };

  const handleClearMessages = () => {
    setMessages([
      {
        text: `Hello! How can I assist you today?\n
        You can ask questions about FIT Data, please set the scope of the data to answer broader questions
        `,
        isUser: false
      }
    ]);
  };

  return (
    <FitGptWrapper>
      <div className="absolute fitgpt-layout" style={{ height: '94.5vh', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '94vh' }}>
          <div className="mt-3 mb-2 flex justify-between gap-1 mr-4 ml-4">
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button basic color='green' disabled={true}>
                <Icon name="book" />
                Data Definitions
              </Button>
              <Button primary basic onClick={() => setShowModal(true)}>
                <Icon name="database" />
                Set FIT Data Scope
              </Button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button primary basic onClick={handleClearMessages}>
                <Icon name="trash" />
                Clear Messages
              </Button>
              <Button primary basic disabled={true} onClick={() => setShowModal(false)}>
                <Icon name="save" />
              </Button>
              <Button basic color='red' disabled={true}>
                <Icon name="history" />
                Saved Conversations
              </Button>
            </div>
          </div>
          <div className="bg-slate-100 border border-gray-300 rounded-lg p-2 flex flex-col flex-grow overflow-hidden">
            <div className="flex-1">
              <Messages messages={messages} isTyping={isTyping} />
            </div>
            <form
              className="bottom-0 left-10 right-0 p-2 border-t border-gray-300 bg-white rounded-lg outline-none w-full"
              onSubmit={handleSendMessage}
            >
              <div className="followup-save mb-3">
                <div className="follow-up">
                  <div className="followup-buttons-container" style={{ display: 'flex', overflowX: 'auto' }}>
                    {followUp.map((question, index) => (
                      <button
                        key={index}
                        className="btn-followup"
                        onClick={(e) => {
                          e.preventDefault();
                          inputRef.current.value = question;
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Ask FitGPT"
                  ref={inputRef}
                  className="messenger-input flex-1 p-2.5 w-full pr-10 border border-blue-700 text-sm outline-none rounded-lg bg-white"
                  onKeyDown={handleKeyDown}
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Icon name="send" />
                </button>
              </div>
            </form>
          </div>
        </div>
        <FitDataScope
          open={showModal}
          onClose={() => setShowModal(false)}
          keys={allKeys}
          values={keyValueMap}
          cards={cards}
          setCards={setCards}
        />
      </div>
    </FitGptWrapper>
  );
}