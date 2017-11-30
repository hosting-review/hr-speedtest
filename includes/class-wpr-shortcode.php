<?php
/**
 * WP-Reactivate
 *
 *
 * @package   WP-Reactivate
 * @author    Pangolin
 * @license   GPL-3.0
 * @link      https://gopangolin.com
 * @copyright 2017 Pangolin (Pty) Ltd
 */

/**
 * @subpackage HRSpeedTest
 */
class HRSpeedTest_Shortcode {

	/**
	 * Instance of this class.
	 *
	 * @since    0.8.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	protected $plugin_slug;

	protected $version;

	public $params = null;

	/**
	 * Return an instance of this class.
	 *
	 * @since     0.8.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance( $params = null ) {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self( $params );
			self::$instance->do_hooks();
		}

		return self::$instance;
	}

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     0.8.0
	 */
	private function __construct( $params = null ) {
		$plugin            = HRSpeedTest::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
		$this->version     = $plugin->get_plugin_version();
		$this->params      = $params;

		add_shortcode( 'hr_speedtest', array( $this, 'shortcode' ) );
	}


	/**
	 * Handle WP actions and filters.
	 *
	 * @since    0.8.0
	 */
	private function do_hooks() {
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_scripts' ) );
	}

	/**
	 * Register frontend-specific javascript
	 *
	 * @since     0.8.0
	 */
	public function register_frontend_scripts() {
		wp_register_script( $this->plugin_slug . '-shortcode-script', plugins_url( 'build/' . $this->params->{'main.js'}, dirname( __FILE__ ) ), [], $this->version );
		wp_register_style( $this->plugin_slug . '-shortcode-style', plugins_url( 'build/' . $this->params->{'main.css'}, dirname( __FILE__ ) ), $this->version );
	}

	public function shortcode( $atts ) {
		wp_enqueue_script( $this->plugin_slug . '-shortcode-script' );
		wp_enqueue_style( $this->plugin_slug . '-shortcode-style' );

		$object_name = 'hrsObject' . uniqid();

		$object = shortcode_atts( array(
			'title'          => 'Website Speed Test',
			'api_nonce'      => wp_create_nonce( 'wp_rest' ),
			'saveResultsUrl' => site_url( '/wp-json/hr-speedtest/v1/test' ),
			'getRecentTests' => trailingslashit( site_url( '/wp-json/hr-speedtest/v1/test' ) ),
			't'              => [
				'Recent Tests'                                                        => __( 'Recent Tests', 'hr-speedtest' ),
				'years'                                                               => __( 'years', 'hr-speedtest' ),
				'months'                                                              => __( 'months', 'hr-speedtest' ),
				'days'                                                                => __( 'days', 'hr-speedtest' ),
				'hours'                                                               => __( 'hours', 'hr-speedtest' ),
				'minutes'                                                             => __( 'minutes', 'hr-speedtest' ),
				'seconds'                                                             => __( 'seconds', 'hr-speedtest' ),
				'URL is not fully qualified domain name'                              => __( 'URL is not fully qualified domain name', 'hr-speedtest' ),
				'URL is required'                                                     => __( 'URL is required', 'hr-speedtest' ),
				'Enter a Website URL'                                                 => __( 'Enter a Website URL', 'hr-speedtest' ),
				'Cancel'                                                              => __( 'Cancel', 'hr-speedtest' ),
				'Check'                                                               => __( 'Check', 'hr-speedtest' ),
				'Click to see website'                                                => __( 'Click to see website', 'hr-speedtest' ),
				'ago'                                                                 => __( 'ago', 'hr-speedtest' ),
				'Test from'                                                           => __( 'Test from', 'hr-speedtest' ),
				'Connection type'                                                     => __( 'Connection type', 'hr-speedtest' ),
				'Browser'                                                             => __( 'Browser', 'hr-speedtest' ),
				'Time To First Byte'                                                  => __( 'Time To First Byte', 'hr-speedtest' ),
				'Cache static content'                                                => __( 'Cache static content', 'hr-speedtest' ),
				'Effective use of CDN'                                                => __( 'Effective use of CDN', 'hr-speedtest' ),
				'Combine js and css files'                                            => __( 'Combine js and css files', 'hr-speedtest' ),
				'Compress Images'                                                     => __( 'Compress Images', 'hr-speedtest' ),
				'No cookies on static content'                                        => __( 'No cookies on static content', 'hr-speedtest' ),
				'Disable E-Tags'                                                      => __( 'Disable E-Tags', 'hr-speedtest' ),
				'Compress Transfer'                                                   => __( 'Compress Transfer', 'hr-speedtest' ),
				'Keep-alive Enabled'                                                  => __( 'Keep-alive Enabled', 'hr-speedtest' ),
				'Minify JavaScript'                                                   => __( 'Minify JavaScript', 'hr-speedtest' ),
				'Progressive JPEGs'                                                   => __( 'Progressive JPEGs', 'hr-speedtest' ),
				'Summary'                                                             => __( 'Summary', 'hr-speedtest' ),
				'Displays screenshot of website that was rendered during first run'   => __( 'Displays screenshot of website that was rendered during first run', 'hr-speedtest' ),
				'Performance grade'                                                   => __( 'Performance grade', 'hr-speedtest' ),
				'Load time'                                                           => __( 'Load time', 'hr-speedtest' ),
				'Page size'                                                           => __( 'Page size', 'hr-speedtest' ),
				'Requests'                                                            => __( 'Requests', 'hr-speedtest' ),
				'Tested from'                                                         => __( 'Tested from', 'hr-speedtest' ),
				'Waterfall'                                                           => __( 'Waterfall', 'hr-speedtest' ),
				'Displays waterfall structure of files downloaded to load website'    => __( 'Displays waterfall structure of files downloaded to load website', 'hr-speedtest' ),
				'Image Preview'                                                       => __( 'Image Preview', 'hr-speedtest' ),
				'The placeholder for zoomed in'                                       => __( 'The placeholder for zoomed in', 'hr-speedtest' ),
				'test might take up to 60 or more seconds after the end of the queue' => __( 'test might take up to 60 or more seconds after the end of the queue', 'hr-speedtest' ),
				'Test Started %d seconds ago'                                         => __( 'Test Started %d seconds ago', 'hr-speedtest' ),
				'Waiting behind %d other tests...'                                    => __( 'Waiting behind %d other tests...', 'hr-speedtest' ),
				'Waiting at the front of the queue...'                                => __( 'Waiting at the front of the queue...', 'hr-speedtest' )
			]
		), $atts, 'hr_speedtest' );

		wp_localize_script( $this->plugin_slug . '-shortcode-script', $object_name, $object );

		ob_start();
		?>
        <div class="webpage-speed-test" data-object-id="<?php echo $object_name ?>">
            <div class="spinner aligncenter">
                <div></div>
            </div>
        </div>
		<?php

		return ob_get_clean();
	}
}
