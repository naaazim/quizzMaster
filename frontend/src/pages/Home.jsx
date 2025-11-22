import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import styles from '../style/Home.module.css';

function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Master Your <br />
            <span className="text-gradient">Coding Skills</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The ultimate platform to create, take, and analyze coding exams.
            <br />Simple, powerful, and designed for developers.
          </p>

          <div className={styles.ctaButtons}>
            <Link to="/signup" className={styles.btnPrimary}>
              Get Started
            </Link>
            <Link to="/login" className={styles.btnSecondary}>
              Login
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
            <pre>
              <code>
                <span className={styles.keyword}>function</span> <span className={styles.function}>masterCode</span>() {'{'}
                {'\n'}  <span className={styles.keyword}>return</span> <span className={styles.string}>"Success"</span>;
                {'\n'}{'}'}
              </code>
            </pre>
          </div>
          <div className={styles.glowOrb}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why <span className="text-gradient">QuizzMaster</span>?</h2>
          <p className={styles.sectionSubtitle}>
            Powerful tools for teachers, trainers, and companies.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} glass-panel`}>
            <div className={styles.featureIcon}>✨</div>
            <h3 className={styles.featureTitle}>Intuitive Interface</h3>
            <p className={styles.featureDescription}>
              Create exams in seconds. No technical knowledge required.
            </p>
          </div>

          <div className={`${styles.featureCard} glass-panel`}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Auto Correction</h3>
            <p className={styles.featureDescription}>
              Get results instantly. Save hours of manual grading.
            </p>
          </div>

          <div className={`${styles.featureCard} glass-panel`}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Detailed Analytics</h3>
            <p className={styles.featureDescription}>
              Track performance and identify gaps with real-time data.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>How it Works</h2>

        <div className={styles.stepsGrid}>
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Create</h3>
            <p className={styles.stepDescription}>Setup your exam and add questions.</p>
          </div>
          <div className={styles.connector}></div>
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Share</h3>
            <p className={styles.stepDescription}>Invite candidates via link.</p>
          </div>
          <div className={styles.connector}></div>
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Analyze</h3>
            <p className={styles.stepDescription}>View results and insights.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={`${styles.ctaCard} glass-panel`}>
          <h2 className={styles.ctaTitle}>Ready to start?</h2>
          <p className={styles.ctaText}>
            Join thousands of users trusting QuizzMaster.
          </p>
          <Link to="/signup" className={styles.btnPrimary}>
            Create Free Account
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export default Home;

