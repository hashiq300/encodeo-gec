import Document, { Head, Html, Main, NextScript } from 'next/document';


export default class _Document extends Document {

    render() {
        return (
            <Html>
                <Head />
                <body className='min-h-screen'>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}