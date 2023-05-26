import './SignWikiCredits.css'
function SignWikiCredits(props: any) {
    return (
        <div
            // style={{ fontSize: '1rem' }}
            className="sign-wiki-credits"
            {...props}
        >
            <p>
                Öll gögn frá{' '}
                <a href="https://is.signwiki.org/index.php/Forsíða">
                    is.signwiki.org
                </a>
                <br />
                Óðinn Dagur Bjarnason
            </p>
        </div>
    )
}

export default SignWikiCredits
