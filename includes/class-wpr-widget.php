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
class HRP_Widget extends WP_Widget {

	/**
	 * Initialize the widget
	 *
	 * @since 0.8.0
	 */
	public function __construct() {
		$plugin = HRSpeedTest::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
		$this->version = $plugin->get_plugin_version();

		$widget_ops = array(
			'description' => esc_html__( 'HR Speed Test demo widget.', 'hr-speedtest' ),
		);

		parent::__construct( 'hrs-widget', esc_html__( 'HR Speed Test', 'hr-speedtest' ), $widget_ops );
	}

	/**
	 * Outputs the content of the widget
	 *
	 * @param array $args
	 * @param array $instance
	 */
	public function widget( $args, $instance ) {
		//wp_enqueue_script( $this->plugin_slug . '-widget-script', plugins_url( 'assets/js/widget.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		//wp_enqueue_style( $this->plugin_slug . '-widget-style', plugins_url( 'assets/css/widget.css', dirname( __FILE__ ) ), $this->version );

		$object_name = 'hrs_object_' . uniqid();

		$object = array(
			'title'       => $instance['title'],
			'api_nonce'   => wp_create_nonce( 'wp_rest' ),
			'api_url'	  => site_url( '/wp-json/hr-speedtest/v1/' ),
		);

		wp_localize_script( $this->plugin_slug . '-widget-script', $object_name, $object );

		echo $args['before_widget'];

		?><div class="hr-speedtest-widget" data-object-id="<?php echo $object_name ?>"></div><?php

		echo $args['after_widget'];
	}

	/**
	 * Outputs the options form on admin
	 *
	 * @param array $instance
	 * @return string|void
	 */
	public function form( $instance ) {
		$title = ( ! empty( $instance['title'] ) ) ? $instance['title'] : '';
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>">
				<?php esc_html_e( 'Title:', 'hr-speedtest' ); ?>
			</label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
		</p>
		<?php
	}

	/**
	 * Processing widget options on save
	 *
	 * @param array $new_instance The new options
	 * @param array $old_instance The previous options
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = array();

		$instance['title'] = sanitize_text_field( $new_instance['title'] );

		return $instance;
	}
}
