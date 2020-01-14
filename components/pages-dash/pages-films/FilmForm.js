import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { FilePond, registerPlugin } from "react-filepond"

import {
  MUIText,
  MUIKeyboardDatePicker,
  MUIPhone,
  MUISwitch,
} from '@hanzo/react'

import {
  Button,
  Container,
  Divider,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core'

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const steps = [
  {
    label: 'Profile',
    form: pug``,
  },
  {
    label: 'Connections',
    form: pug``,
  },
  {
    label: 'Assets',
    form: pug``,
  },
  {
    label: 'Completed',
    form: pug``,
  },
]

@inject("store")
@observer
class FilmForm extends Component {
  state = {
    stepIdx: 0
  }

  constructor(props) {
    super(props)
  }

  back() {
    this.setState({
      stepIdx: this.state.stepIdx-1,
    })
  }

  canBack() {
    return this.state.stepIndex > 0
  }

  next() {
    this.setState({
      stepIdx: this.state.stepIdx+1,
    })
  }

  canNext() {
    return this.state.stepIndex < steps.length
  }

  isDone() {
    return this.state.stepIndex === steps.length
  }

  render() {
    const { stepIdx } = this.state

    return <> {
      pug`
        div.film-form.form
          Stepper(activeStep=stepIdx)
            each step, i in steps
              Step(key=i)
                StepLabel
                  =step.label
          Typography(variant='h6' align='center')
            =steps[stepIdx].label
          br
          if stepIdx === 0
            Container(maxWidth='sm')
              Typography(variant='body1' align='center')
                | Fill in the info below.
              br
              Grid(container spacing=2)
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Film Name'
                    variant='outlined'
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Film Tagline'
                    variant='outlined'
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Film URL'
                    variant='outlined'
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Film Location'
                    variant='outlined'
                  )
                Grid(item xs=12)
                  MUIText(
                    label='Film Genres'
                    variant='outlined'
                  )
              br
              Button(
                color='primary'
                variant='contained'
                size='large'
                onClick=() => this.next()
              )
                | Next
          if stepIdx === 1
            Container(maxWidth='sm')
              Typography(variant='body1' align='center')
                | Connect your social networks and website. These educate and demonstrate your credibility.
              br
              Grid(container spacing=2)
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Contact Email'
                    variant='outlined'
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Contact Number'
                    variant='outlined'
                  )
              br
              Divider(variant='middle')
              br
              Typography(variant='body1' align='center')
                | Enter the URLs from your social profiles
              br
              Grid(container spacing=2)
                Grid(item xs=12)
                  MUIText(
                    label='Facebook'
                    variant='outlined'
                  )
                Grid(item xs=12)
                  MUIText(
                    label='Film Genres'
                    variant='outlined'
                  )
              br
              Grid(container spacing=2)
                Grid(item)
                  Button(
                    size='large'
                    onClick=() => this.back()
                  )
                    | Back
                Grid(item)
                  Button(
                    color='primary'
                    variant='contained'
                    size='large'
                    onClick=() => this.next()
                  )
                    | Next
          if stepIdx === 2
            Container(maxWidth='sm')
              Typography(variant='body1' align='center')
                | Upload your logo and featured image to your profile.
              br
              Typography(variant='body2')
                | Logo
              FilePond(
                maxFiles=1
              )
              Typography(variant='body2')
                | Featured Image
              FilePond(
                maxFiles=1
              )
              br
              Divider(variant='middle')
              br
              Typography(variant='body1')
                | Your video is one of the most effective ways to tell your story. Tell us about the problem your business solves and include a demo of your product or service if applicable. Whenever possible, feature yourself and your co-founders in the video as an opportunity for supporters to meet the real people behind your Film.
              br
              MUIText(
                label='Video URL'
                variant='outlined'
              )
              br
              Typography(variant='body2')
                | Note: Your public video must not contain any private deal information.
              br
              Divider(variant='middle')
              br
              Typography(variant='body1')
                | This is where you make your business case. Questions to help jumpstart your thinking: Who is your market? What are your differentiators? What makes you viable? What are your indicators of success? What are your plans to scale?
              br
              MUIText(
                label='Slide URL'
                variant='outlined'
              )
              br
              Typography(variant='body2')
                | Note: Your public slideshare must not contain any private deal information.
              Typography(variant='body2')
                | - Film Basics
              Typography(variant='body2')
                | - Film Profile
              Typography(variant='body2')
                | - Investment Details
              br
              Grid(container spacing=2)
                Grid(item)
                  Button(
                    size='large'
                    onClick=() => this.back()
                  )
                    | Back
                Grid(item)
                  Button(
                    color='primary'
                    variant='contained'
                    size='large'
                    onClick=() => this.next()
                  )
                    | Complete
              br
              br
          if stepIdx === 3
            Container(maxWidth='sm')
              Typography(variant='body1' align='center')
                | Your film has been submitted!
      `}
    </>
  }
}

export default FilmForm
