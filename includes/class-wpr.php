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
 * @package WP-Reactivate
 */
class HRSpeedTest {

	/**
	 * The variable name is used as the text domain when internationalizing strings
	 * of text. Its value should match the Text Domain file header in the main
	 * plugin file.
	 *
	 * @since    0.8.0
	 *
	 * @var      string
	 */
	protected $plugin_slug = 'hr-speedtest';

	/**
	 * Instance of this class.
	 *
	 * @since    0.8.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Setup instance attributes
	 *
	 * @since     0.8.0
	 */
	private function __construct() {
		$this->plugin_version = HR_SPEEDTEST_VERSION;
	}

	/**
	 * Return the plugin slug.
	 *
	 * @since    0.8.0
	 *
	 * @return    Plugin slug variable.
	 */
	public function get_plugin_slug() {
		return $this->plugin_slug;
	}

	/**
	 * Return the plugin version.
	 *
	 * @since    0.8.0
	 *
	 * @return    Plugin slug variable.
	 */
	public function get_plugin_version() {
		return $this->plugin_version;
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since    0.8.0
	 */
	public static function activate() {
		update_option( 'hrspeedtest', 'Test Value' );
	}

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since    0.8.0
	 */
	public static function deactivate() {
	}


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
		}

		return self::$instance;
	}
}
